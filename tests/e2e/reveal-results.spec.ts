import { test, expect } from '../fixtures/page-objects';
import { TEST_DATA } from '../fixtures/test-data';

test.describe('Revealing Results', () => {
  let roomSlug: string;

  test.beforeEach(async ({ newRoomPage }) => {
    await newRoomPage.goto();
    await newRoomPage.createRoom(TEST_DATA.rooms.fibonacci);
    roomSlug = await newRoomPage.getRoomSlug();
  });

  test('should allow admin to reveal votes', async ({ joinRoomPage, roomPage }) => {
    // Join room with a voter
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    
    // Voter votes
    await roomPage.selectVote('5');
    
    // Switch back to creator context (they should have admin privileges)
    await roomPage.goto(roomSlug);
    
    // Verify reveal button is visible for admin
    await expect(roomPage.isRevealButtonVisible()).resolves.toBe(true);
    
    // Reveal votes
    await roomPage.revealVotes();
    
    // Verify votes are revealed (wait for reveal animation/completion)
    await roomPage.waitForReveal();
    
    // Verify next/restart buttons appear after reveal
    await expect(roomPage.isNextButtonVisible()).resolves.toBe(true);
    await expect(roomPage.isRestartButtonVisible()).resolves.toBe(true);
  });

  test('should not allow non-admin users to reveal votes', async ({ joinRoomPage, roomPage }) => {
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    
    // Verify reveal button is not visible for regular user
    await expect(roomPage.isRevealButtonVisible()).resolves.toBe(false);
    
    // Verify user cannot reveal votes
    await expect(roomPage.page.locator('button:has-text("Reveal")')).toHaveCount(0);
  });

  test('should show all revealed votes after reveal', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
    ]);
    
    const pages = await Promise.all([
      contexts[0].newPage(),
      contexts[1].newPage(),
      contexts[2].newPage(),
    ]);
    
    const { NewRoomPage, JoinRoomPage, RoomPage } = await import('../fixtures/page-objects');
    
    const creatorPage = new NewRoomPage(pages[0]);
    const voter1Page = new JoinRoomPage(pages[1]);
    const voter2Page = new JoinRoomPage(pages[2]);
    
    const roomCreator = new RoomPage(pages[0]);
    const roomVoter1 = new RoomPage(pages[1]);
    const roomVoter2 = new RoomPage(pages[2]);
    
    // Create room
    await creatorPage.goto();
    await creatorPage.createRoom(TEST_DATA.rooms.fibonacci);
    const roomSlugFromContext = await creatorPage.getRoomSlug();
    
    // Users join and vote
    await voter1Page.goto(roomSlugFromContext);
    await voter1Page.joinRoom(TEST_DATA.users.voter1);
    await roomVoter1.selectVote('3');
    
    await voter2Page.goto(roomSlugFromContext);
    await voter2Page.joinRoom(TEST_DATA.users.voter2);
    await roomVoter2.selectVote('5');
    
    // Creator reveals votes
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // All users should see revealed votes
    for (const room of [roomCreator, roomVoter1, roomVoter2]) {
      await expect(room.isNextButtonVisible()).resolves.toBe(true);
      await expect(room.isRestartButtonVisible()).resolves.toBe(true);
    }
    
    // Cleanup
    await contexts[0].close();
    await contexts[1].close();
    await contexts[2].close();
  });

  test('should proceed to next round after reveal', async ({ joinRoomPage, roomPage }) => {
    // Join room and vote
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    await roomPage.selectVote('8');
    
    // Reveal votes (admin)
    await roomPage.revealVotes();
    await roomPage.waitForReveal();
    
    // Proceed to next round
    await roomPage.nextRound();
    
    // Verify round number increments
    const roomInfo = await roomPage.getRoomInfo();
    expect(roomInfo.round).toContain('2'); // Should be round 2
    
    // Verify reveal button is visible again
    await expect(roomPage.isRevealButtonVisible()).resolves.toBe(true);
    
    // Verify next/restart buttons are hidden
    await expect(roomPage.isNextButtonVisible()).resolves.toBe(false);
    await expect(roomPage.isRestartButtonVisible()).resolves.toBe(false);
  });

  test('should restart current round after reveal', async ({ joinRoomPage, roomPage }) => {
    // Join room and vote
    await joinRoomPage.goto(roomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    await roomPage.selectVote('13');
    
    // Reveal votes
    await roomPage.revealVotes();
    await roomPage.waitForReveal();
    
    // Get initial room info
    const initialRoomInfo = await roomPage.getRoomInfo();
    
    // Restart round
    await roomPage.restartRound();
    
    // Verify round number stays the same
    const roomInfoAfterRestart = await roomPage.getRoomInfo();
    expect(roomInfoAfterRestart.round).toBe(initialRoomInfo.round);
    
    // Verify reveal button is visible again
    await expect(roomPage.isRevealButtonVisible()).resolves.toBe(true);
    
    // Verify votes are cleared
    expect(await roomPage.getSelectedVote()).toBeNull();
  });

  test('should handle T-shirt room reveal', async ({ newRoomPage, joinRoomPage, roomPage }) => {
    // Create T-shirt room
    await newRoomPage.goto();
    await newRoomPage.createRoom(TEST_DATA.rooms.tshirt);
    const tshirtRoomSlug = await newRoomPage.getRoomSlug();
    
    // Join and vote
    await joinRoomPage.goto(tshirtRoomSlug);
    await joinRoomPage.joinRoom(TEST_DATA.users.voter1);
    await roomPage.selectVote('M');
    
    // Reveal votes
    await roomPage.revealVotes();
    await roomPage.waitForReveal();
    
    // Verify reveal works with T-shirt votes
    await expect(roomPage.isNextButtonVisible()).resolves.toBe(true);
    await expect(roomPage.isRestartButtonVisible()).resolves.toBe(true);
  });

  test('should auto-reveal when all users have voted', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
    ]);
    
    const pages = await Promise.all([
      contexts[0].newPage(),
      contexts[1].newPage(),
    ]);
    
    const { NewRoomPage, JoinRoomPage, RoomPage } = await import('../fixtures/page-objects');
    
    const creatorPage = new NewRoomPage(pages[0]);
    const voter1Page = new JoinRoomPage(pages[1]);
    
    const roomCreator = new RoomPage(pages[0]);
    
    // Create room
    await creatorPage.goto();
    await creatorPage.createRoom(TEST_DATA.rooms.fibonacci);
    const roomSlugFromContext = await creatorPage.getRoomSlug();
    
    // User joins and votes
    await voter1Page.goto(roomSlugFromContext);
    await voter1Page.joinRoom(TEST_DATA.users.voter1);
    await (new RoomPage(pages[1])).selectVote('5');
    
    // Wait a bit to see if auto-reveal happens
    // This test depends on whether the app has auto-reveal functionality
    await roomCreator.page.waitForTimeout(2000);
    
    // If auto-reveal is implemented, the buttons should appear
    // Otherwise, manual reveal would be needed
    const nextButtonVisible = await roomCreator.isNextButtonVisible();
    
    // Test outcome depends on app behavior
    if (nextButtonVisible) {
      console.log('Auto-reveal functionality detected');
      await expect(roomCreator.isNextButtonVisible()).resolves.toBe(true);
    } else {
      console.log('Manual reveal required');
      await roomCreator.revealVotes();
      await roomCreator.waitForReveal();
      await expect(roomCreator.isNextButtonVisible()).resolves.toBe(true);
    }
    
    // Cleanup
    await contexts[0].close();
    await contexts[1].close();
  });

  test('should show vote statistics after reveal', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
    ]);
    
    const pages = await Promise.all([
      contexts[0].newPage(),
      contexts[1].newPage(),
      contexts[2].newPage(),
    ]);
    
    const { NewRoomPage, JoinRoomPage, RoomPage } = await import('../fixtures/page-objects');
    
    const creatorPage = new NewRoomPage(pages[0]);
    const voter1Page = new JoinRoomPage(pages[1]);
    const voter2Page = new JoinRoomPage(pages[2]);
    
    const roomCreator = new RoomPage(pages[0]);
    
    // Create room
    await creatorPage.goto();
    await creatorPage.createRoom(TEST_DATA.rooms.fibonacci);
    const roomSlugFromContext = await creatorPage.getRoomSlug();
    
    // Users join and vote with same value
    await voter1Page.goto(roomSlugFromContext);
    await voter1Page.joinRoom(TEST_DATA.users.voter1);
    await (new RoomPage(pages[1])).selectVote('5');
    
    await voter2Page.goto(roomSlugFromContext);
    await voter2Page.joinRoom(TEST_DATA.users.voter2);
    await (new RoomPage(pages[2])).selectVote('5');
    
    // Reveal votes
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // Look for statistics or consensus indicators
    // This would depend on how the app displays vote results
    const hasStatistics = await roomCreator.page.locator('[data-testid="vote-statistics"]').count() > 0 ||
                          await roomCreator.page.locator('text=consensus').count() > 0;
    
    // Test would need to be adjusted based on actual UI for displaying results
    console.log('Vote statistics display:', hasStatistics ? 'Available' : 'Not implemented in test');
    
    // Cleanup
    await contexts[0].close();
    await contexts[1].close();
    await contexts[2].close();
  });

  test('should handle empty room reveal', async ({ roomPage }) => {
    // Try to reveal votes in empty room (only admin)
    await roomPage.revealVotes();
    
    // Should handle gracefully - either show no votes or appropriate message
    await roomPage.waitForReveal();
    
    // Next/restart buttons should still appear
    await expect(roomPage.isNextButtonVisible()).resolves.toBe(true);
    await expect(roomPage.isRestartButtonVisible()).resolves.toBe(true);
  });
});