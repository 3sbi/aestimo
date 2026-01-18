import { test, expect } from '../fixtures/page-objects';
import { TEST_DATA } from '../fixtures/test-data';

test.describe('Complete Planning Poker Flow', () => {
  test('full workflow: create room -> multiple users join -> vote -> reveal -> next round', async ({ browser }) => {
    // Create separate browser contexts for each user to simulate independent sessions
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
    
    // Get page object classes
    const { NewRoomPage, JoinRoomPage, RoomPage } = await import('../fixtures/page-objects');
    
    // Initialize page objects
    const creatorPage = new NewRoomPage(pages[0]);
    const voter1Page = new JoinRoomPage(pages[1]);
    const voter2Page = new JoinRoomPage(pages[2]);
    
    const roomCreator = new RoomPage(pages[0]);
    const roomVoter1 = new RoomPage(pages[1]);
    const roomVoter2 = new RoomPage(pages[2]);
    
    // Step 1: Creator creates a Fibonacci room
    await creatorPage.goto();
    await creatorPage.createRoom({
      name: 'Sprint Planning Session',
      username: TEST_DATA.users.creator,
      voteType: 'fibonacci',
      private: false
    });
    
    const roomSlug = await creatorPage.getRoomSlug();
    expect(roomSlug).toBeTruthy();
    
    // Step 2: Verify creator is in room with admin privileges
    await expect(roomCreator.isRevealButtonVisible()).resolves.toBe(true);
    await expect(roomCreator.isAdmin()).resolves.toBe(true);
    
    // Step 3: First voter joins the room
    await voter1Page.goto(roomSlug);
    await voter1Page.joinRoom(TEST_DATA.users.voter1);
    
    // Step 4: Second voter joins the room
    await voter2Page.goto(roomSlug);
    await voter2Page.joinRoom(TEST_DATA.users.voter2);
    
    // Step 5: Verify all users are in the same room
    await expect(creatorPage.page).toHaveURL(`/rooms/${roomSlug}`);
    await expect(voter1Page.page).toHaveURL(`/rooms/${roomSlug}`);
    await expect(voter2Page.page).toHaveURL(`/rooms/${roomSlug}`);
    
    // Step 6: Verify non-admin users don't have admin privileges
    await expect(roomVoter1.isRevealButtonVisible()).resolves.toBe(false);
    await expect(roomVoter2.isRevealButtonVisible()).resolves.toBe(false);
    
    // Step 7: Users vote
    await roomVoter1.selectVote('5');
    await roomVoter2.selectVote('8');
    
    // Step 8: Verify votes are selected
    expect(await roomVoter1.getSelectedVote()).toBe('5');
    expect(await roomVoter2.getSelectedVote()).toBe('8');
    
    // Step 9: Verify user statuses show as voted
    expect(await roomVoter1.getUserVoteStatus(TEST_DATA.users.voter1)).toBe('voted');
    expect(await roomVoter2.getUserVoteStatus(TEST_DATA.users.voter2)).toBe('voted');
    
    // Step 10: Creator reveals votes
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // Step 11: Verify reveal is visible to all users
    for (const room of [roomCreator, roomVoter1, roomVoter2]) {
      await expect(room.isNextButtonVisible()).resolves.toBe(true);
      await expect(room.isRestartButtonVisible()).resolves.toBe(true);
    }
    
    // Step 12: Proceed to next round
    await roomCreator.nextRound();
    
    // Step 13: Verify round number incremented
    const roomInfo = await roomCreator.getRoomInfo();
    expect(roomInfo.round).toContain('2');
    
    // Step 14: Verify votes are cleared for new round
    expect(await roomVoter1.getSelectedVote()).toBeNull();
    expect(await roomVoter2.getSelectedVote()).toBeNull();
    
    // Step 15: Verify user statuses reset
    expect(await roomVoter1.getUserVoteStatus(TEST_DATA.users.voter1)).toBe('not_voted');
    expect(await roomVoter2.getUserVoteStatus(TEST_DATA.users.voter2)).toBe('not_voted');
    
    // Step 16: Users vote again in round 2
    await roomVoter1.selectVote('13');
    await roomVoter2.selectVote('13');
    
    // Step 17: Creator reveals round 2
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // Step 18: Restart the current round
    await roomCreator.restartRound();
    
    // Step 19: Verify round number stays the same
    const roomInfoAfterRestart = await roomCreator.getRoomInfo();
    expect(roomInfoAfterRestart.round).toBe(roomInfo.round);
    
    // Step 20: Verify votes are cleared after restart
    expect(await roomVoter1.getSelectedVote()).toBeNull();
    expect(await roomVoter2.getSelectedVote()).toBeNull();
    
    // Cleanup
    await contexts[0].close();
    await contexts[1].close();
    await contexts[2].close();
  });

  test('T-shirt sizing workflow with multiple rounds', async ({ browser }) => {
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
    const roomVoter1 = new RoomPage(pages[1]);
    
    // Create T-shirt room
    await creatorPage.goto();
    await creatorPage.createRoom({
      name: 'T-shirt Sizing Session',
      username: TEST_DATA.users.creator,
      voteType: 'tshirt',
      private: false
    });
    
    const roomSlug = await creatorPage.getRoomSlug();
    
    // Voter joins
    await voter1Page.goto(roomSlug);
    await voter1Page.joinRoom(TEST_DATA.users.voter1);
    
    // Verify T-shirt options
    const availableVotes = await roomCreator.getVotesInRoom();
    expect(availableVotes).toEqual(expect.arrayContaining(TEST_DATA.votes.tshirt));
    
    // Vote with T-shirt sizes
    await roomCreator.selectVote('L');
    await roomVoter1.selectVote('M');
    
    // Reveal votes
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // Proceed to next round
    await roomCreator.nextRound();
    
    // Vote again
    await roomCreator.selectVote('XL');
    await roomVoter1.selectVote('XL');
    
    // Reveal again
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // Cleanup
    await contexts[0].close();
    await contexts[1].close();
  });

  test('private room workflow', async ({ browser }) => {
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
    
    // Create private room
    await creatorPage.goto();
    await creatorPage.createRoom({
      name: 'Private Strategy Session',
      username: TEST_DATA.users.creator,
      voteType: 'fibonacci',
      private: true,
      prefix: 'strategy'
    });
    
    const roomSlug = await creatorPage.getRoomSlug();
    
    // Verify room slug contains custom prefix
    expect(roomSlug).toContain('strategy');
    
    // Voter joins private room
    await voter1Page.goto(roomSlug);
    await voter1Page.joinRoom(TEST_DATA.users.voter1);
    
    // Verify successful join
    await expect(voter1Page.page).toHaveURL(`/rooms/${roomSlug}`);
    
    // Test voting in private room
    await roomCreator.selectVote('21');
    await (new RoomPage(pages[1])).selectVote('34');
    
    // Reveal votes
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // Cleanup
    await contexts[0].close();
    await contexts[1].close();
  });

  test('handle user disconnection and reconnection', async ({ browser }) => {
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
    const roomVoter1 = new RoomPage(pages[1]);
    
    // Create room
    await creatorPage.goto();
    await creatorPage.createRoom(TEST_DATA.rooms.fibonacci);
    const roomSlug = await creatorPage.getRoomSlug();
    
    // Voter joins
    await voter1Page.goto(roomSlug);
    await voter1Page.joinRoom(TEST_DATA.users.voter1);
    
    // Voter votes
    await roomVoter1.selectVote('13');
    expect(await roomVoter1.getSelectedVote()).toBe('13');
    
    // Simulate user disconnection by closing context
    await contexts[1].close();
    
    // Wait a bit
    await roomCreator.page.waitForTimeout(1000);
    
    // User reconnects by creating new context and page
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    const newVoter1Page = new JoinRoomPage(newPage);
    const newRoomVoter1 = new RoomPage(newPage);
    
    // Rejoin room
    await newVoter1Page.goto(roomSlug);
    await newVoter1Page.joinRoom(TEST_DATA.users.voter1);
    
    // Verify user is back in room
    await expect(newVoter1Page.page).toHaveURL(`/rooms/${roomSlug}`);
    
    // Vote again
    await newRoomVoter1.selectVote('8');
    expect(await newRoomVoter1.getSelectedVote()).toBe('8');
    
    // Cleanup
    await contexts[0].close();
    await newContext.close();
  });

  test('stress test with multiple users', async ({ browser }) => {
    const numUsers = 5;
    const contexts = await Promise.all(
      Array.from({ length: numUsers }, () => browser.newContext())
    );
    
    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );
    
    const { NewRoomPage, JoinRoomPage, RoomPage } = await import('../fixtures/page-objects');
    
    // Creator creates room
    const creatorPage = new NewRoomPage(pages[0]);
    await creatorPage.goto();
    await creatorPage.createRoom(TEST_DATA.rooms.fibonacci);
    const roomSlug = await creatorPage.getRoomSlug();
    
    // Multiple users join
    const joinPromises = pages.slice(1).map(async (page, index) => {
      const joinPage = new JoinRoomPage(page);
      const roomPage = new RoomPage(page);
      const username = `Voter${index + 1}`;
      
      await joinPage.goto(roomSlug);
      await joinPage.joinRoom(username);
      
      return { username, roomPage };
    });
    
    const voters = await Promise.all(joinPromises);
    
    // All users vote
    const votePromises = voters.map(async ({ roomPage }) => {
      const votes = TEST_DATA.votes.fibonacci;
      const randomVote = votes[Math.floor(Math.random() * votes.length)];
      await roomPage.selectVote(randomVote);
      return randomVote;
    });
    
    const selectedVotes = await Promise.all(votePromises);
    
    // Creator reveals votes
    const roomCreator = new RoomPage(pages[0]);
    await roomCreator.revealVotes();
    await roomCreator.waitForReveal();
    
    // Verify all users see the reveal
    for (const { roomPage } of voters) {
      await expect(roomPage.isNextButtonVisible()).resolves.toBe(true);
    }
    
    // Cleanup all contexts
    await Promise.all(contexts.map(context => context.close()));
  });
});