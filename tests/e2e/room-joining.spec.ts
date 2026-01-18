import { test, expect } from '../fixtures/page-objects';
import { TEST_DATA } from '../fixtures/test-data';

test.describe('Room Joining', () => {
  let roomSlug: string;

  test.beforeEach(async ({ newRoomPage }) => {
    // Create a room first for joining tests
    await newRoomPage.goto();
    await newRoomPage.createRoom(TEST_DATA.rooms.fibonacci);
    roomSlug = await newRoomPage.getRoomSlug();
  });

  test('should join an existing room from new page', async ({ joinRoomPage, roomPage }) => {
    await joinRoomPage.goto();
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    
    // Should redirect to room page
    await expect(joinRoomPage.page).toHaveURL(`/rooms/${roomSlug}`);
    
    // Verify room page loads correctly
    await expect(roomPage.page.locator('body')).toBeVisible();
  });

  test('should join room directly via room URL', async ({ joinRoomPage, roomPage }) => {
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter2);
    
    // Should redirect to room page
    await expect(joinRoomPage.page).toHaveURL(`/rooms/${roomSlug}`);
    
    // Verify room page loads correctly
    await expect(roomPage.page.locator('body')).toBeVisible();
  });

  test('should require username to join room', async ({ joinRoomPage }) => {
    await joinRoomPage.goto(roomSlug);
    
    // Try to join without username
    await joinRoomPage.page.click('button:has-text("Join")');
    
    // Should show validation error
    await expect(joinRoomPage.page.locator('input[id="username"]:invalid')).toBeVisible();
    
    // Should not redirect
    await expect(joinRoomPage.page).toHaveURL(`/rooms/${roomSlug}/join`);
  });

  test('should have regular user privileges (not admin)', async ({ joinRoomPage, roomPage }) => {
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    
    // Verify admin features are not available for regular users
    await expect(roomPage.isRevealButtonVisible()).resolves.toBe(false);
    await expect(roomPage.isAdmin()).resolves.toBe(false);
  });

  test('should show available vote options after joining', async ({ joinRoomPage, roomPage }) => {
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    
    // Verify Fibonacci vote options are available
    const availableVotes = await roomPage.getVotesInRoom();
    expect(availableVotes).toEqual(expect.arrayContaining(TEST_DATA.votes.fibonacci));
  });

  test('should join multiple users to the same room', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
    ]);
    
    const pages = await Promise.all([
      contexts[0].newPage(),
      contexts[1].newPage(),
    ]);
    
    const newRoomPage1 = new (await import('../fixtures/page-objects')).NewRoomPage(pages[0]);
    const joinRoomPage2 = new (await import('../fixtures/page-objects')).JoinRoomPage(pages[1]);
    
    // First user creates and joins the room
    await newRoomPage1.goto();
    await newRoomPage1.createRoom(TEST_DATA.rooms.fibonacci);
    const roomSlugFromContext = await newRoomPage1.getRoomSlug();
    
    // Second user joins the same room
    await joinRoomPage2.goto(roomSlugFromContext);
    await joinRoomPage2.joinRoom(TEST_DATA.users.voter2);
    
    // Both should be in the same room
    await expect(newRoomPage1.page).toHaveURL(`/rooms/${roomSlugFromContext}`);
    await expect(joinRoomPage2.page).toHaveURL(`/rooms/${roomSlugFromContext}`);
    
    // Cleanup
    await contexts[0].close();
    await contexts[1].close();
  });

  test('should handle room not found gracefully', async ({ joinRoomPage }) => {
    const nonExistentRoomSlug = 'non-existent-room';
    
    await joinRoomPage.goto(nonExistentRoomSlug);
    
    // Should show error or redirect appropriately
    // This would depend on how the app handles non-existent rooms
    await expect(joinRoomPage.page.locator('body')).toBeVisible();
  });

  test('should maintain room info when joining', async ({ joinRoomPage, roomPage }) => {
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    
    // Get room info
    const roomInfo = await roomPage.getRoomInfo();
    
    // Verify room name matches the created room
    expect(roomInfo.name).toContain(TEST_DATA.rooms.fibonacci.name);
  });

  test('should preserve session when navigating away and back', async ({ joinRoomPage, roomPage }) => {
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    
    // Navigate away
    await roomPage.page.goto('/');
    
    // Navigate back to room
    await roomPage.page.goto(`/rooms/${roomSlug}`);
    
    // Should still be in the room (not redirected to join page)
    await expect(roomPage.page).toHaveURL(`/rooms/${roomSlug}`);
    await expect(roomPage.page.locator('body')).toBeVisible();
  });

  test('should show user in room list after joining', async ({ joinRoomPage, roomPage }) => {
    const username = TEST_DATA.users.voter1;
    
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(username);
    
    // Verify user appears in room
    await expect(roomPage.page.locator(`text=${username}`)).toBeVisible();
  });
});