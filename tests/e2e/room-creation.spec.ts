import { test, expect } from "../fixtures/page-objects";
import { TEST_DATA } from "../fixtures/test-data";

test.describe("Room Creation", () => {
  test.beforeEach(async ({ newRoomPage }) => {
    await newRoomPage.goto();
  });

  test("should create a public Fibonacci room", async ({
    newRoomPage,
    roomPage,
  }) => {
    const roomData = TEST_DATA.rooms.fibonacci;

    await newRoomPage.createRoom(roomData);

    // Should redirect to room page
    await expect(newRoomPage.page).toHaveURL(/\/rooms\/.+/);

    // Get room slug for verification
    const roomSlug = await newRoomPage.getRoomSlug();
    expect(roomSlug).toBeDefined();
    expect(roomSlug.length).toBeGreaterThan(0);

    // Verify room page loads correctly
    await roomPage.goto(roomSlug);
    await expect(roomPage.page.locator("body")).toBeVisible();
  });

  test("should create a T-shirt sizing room", async ({
    newRoomPage,
    roomPage,
  }) => {
    const roomData = TEST_DATA.rooms.tshirt;

    await newRoomPage.createRoom(roomData);

    // Should redirect to room page
    await expect(newRoomPage.page).toHaveURL(/\/rooms\/.+/);

    const roomSlug = await newRoomPage.getRoomSlug();
    expect(roomSlug).toBeDefined();
    expect(roomSlug.length).toBeGreaterThan(0);

    // Verify the correct vote options are available
    const availableVotes = await roomPage.getVotesInRoom();
    expect(availableVotes).toEqual(
      expect.arrayContaining(TEST_DATA.votes.tshirt),
    );
  });

  test("should create a private room with custom prefix", async ({
    newRoomPage,
  }) => {
    const roomData = TEST_DATA.rooms.privateRoom;

    await newRoomPage.createRoom(roomData);

    // Should redirect to room page
    await expect(newRoomPage.page).toHaveURL(/\/rooms\/.+/);

    const roomSlug = await newRoomPage.getRoomSlug();

    // Verify the room slug contains the custom prefix
    expect(roomSlug).toContain(roomData.prefix);
  });

  test("should validate required fields", async ({ newRoomPage }) => {
    // Try to create room without filling required fields
    await newRoomPage.page.click('button:has-text("Create room")');

    // Should show validation errors
    await expect(
      newRoomPage.page.locator('input[name="name"]:invalid'),
    ).toBeVisible();
    await expect(
      newRoomPage.page.locator('input[name="username"]:invalid'),
    ).toBeVisible();
  });

  test("should redirect to room with correct URL structure", async ({
    newRoomPage,
  }) => {
    const roomData = TEST_DATA.rooms.fibonacci;

    await newRoomPage.createRoom(roomData);

    // Verify URL structure: /rooms/[roomSlug]
    const currentUrl = newRoomPage.page.url();
    const urlPattern = /\/rooms\/[a-zA-Z0-9-]+$/;
    expect(currentUrl).toMatch(urlPattern);
  });

  test("should have admin privileges as room creator", async ({
    newRoomPage,
    roomPage,
  }) => {
    const roomData = TEST_DATA.rooms.fibonacci;

    await newRoomPage.createRoom(roomData);
    const roomSlug = await newRoomPage.getRoomSlug();

    await roomPage.goto(roomSlug);

    // Verify admin features are available
    await expect(roomPage.isRevealButtonVisible()).resolves.toBe(true);
    await expect(roomPage.isAdmin()).resolves.toBe(true);
  });

  test("should show room information after creation", async ({
    newRoomPage,
    roomPage,
  }) => {
    const roomData = TEST_DATA.rooms.fibonacci;

    await newRoomPage.createRoom(roomData);
    const roomSlug = await newRoomPage.getRoomSlug();

    await roomPage.goto(roomSlug);

    // Get room info
    const roomInfo = await roomPage.getRoomInfo();

    // Verify room name matches
    expect(roomInfo.name).toContain(roomData.name);

    // Verify round starts at 1
    expect(roomInfo.round).toContain("1");
  });

  test("should support both Fibonacci and T-shirt vote types", async ({
    newRoomPage,
    roomPage,
  }) => {
    // Test Fibonacci room
    await newRoomPage.createRoom(TEST_DATA.rooms.fibonacci);
    let roomSlug = await newRoomPage.getRoomSlug();

    await roomPage.goto(roomSlug);
    let fibonacciVotes = await roomPage.getVotesInRoom();
    expect(fibonacciVotes).toEqual(
      expect.arrayContaining(TEST_DATA.votes.fibonacci),
    );

    // Go back and test T-shirt room
    await newRoomPage.goto();
    await newRoomPage.createRoom(TEST_DATA.rooms.tshirt);
    roomSlug = await newRoomPage.getRoomSlug();

    await roomPage.goto(roomSlug);
    let tshirtVotes = await roomPage.getVotesInRoom();
    expect(tshirtVotes).toEqual(expect.arrayContaining(TEST_DATA.votes.tshirt));
  });
});
