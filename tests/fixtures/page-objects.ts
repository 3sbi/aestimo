import { test as base, type Page } from '@playwright/test';

export interface TestFixtures {
  newRoomPage: NewRoomPage;
  roomPage: RoomPage;
  joinRoomPage: JoinRoomPage;
  homePage: HomePage;
}

export const test = base.extend<TestFixtures>({
  newRoomPage: async ({ page }, use) => {
    await use(new NewRoomPage(page));
  },
  roomPage: async ({ page }, use) => {
    await use(new RoomPage(page));
  },
  joinRoomPage: async ({ page }, use) => {
    await use(new JoinRoomPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export const expect = test.expect;

export class HomePage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async navigateToCreateRoom() {
    await this.page.click('a[href*="new?tab=create"]');
  }

  async navigateToJoinRoom() {
    await this.page.click('a[href*="new?tab=join"]');
  }
}

export class NewRoomPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/new?tab=create');
  }

  async createRoom(data: {
    name: string;
    username: string;
    voteType?: string;
    private?: boolean;
    prefix?: string;
  }) {
    await this.page.fill('input[name="name"]', data.name);
    await this.page.fill('input[name="username"]', data.username);
    
    if (data.voteType) {
      await this.page.click(`input[name="voteType"][value="${data.voteType}"]`);
    }
    
    if (data.private) {
      await this.page.click('input[id="private"]');
    }
    
    if (data.prefix) {
      await this.page.fill('input[name="prefix"]', data.prefix);
    }

    await this.page.click('button:has-text("Create room")');
  }

  async getRoomSlug(): Promise<string> {
    await this.page.waitForURL('**/rooms/**');
    const url = this.page.url();
    return url.split('/rooms/')[1].split('/')[0];
  }
}

export class JoinRoomPage {
  constructor(public page: Page) {}

  async goto(roomSlug?: string) {
    if (roomSlug) {
      await this.page.goto(`/rooms/${roomSlug}/join`);
    } else {
      await this.page.goto('/new?tab=join');
    }
  }

  async joinRoom(username: string, roomSlug?: string) {
    await this.page.fill('input[id="username"]', username);
    await this.page.click('button:has-text("Join")');
  }

  async getRoomSlug(): Promise<string> {
    await this.page.waitForURL('**/rooms/**');
    const url = this.page.url();
    return url.split('/rooms/')[1].split('/')[0];
  }
}

export class RoomPage {
  constructor(public page: Page) {}

  async goto(roomSlug: string) {
    await this.page.goto(`/rooms/${roomSlug}`);
  }

  async selectVote(voteValue: string) {
    await this.page.click(`div[title="${voteValue}"]`);
  }

  async getSelectedVote(): Promise<string | null> {
    const selectedCard = this.page.locator('div.px-4.py-4.border-2.rounded-lg.cursor-pointer.font-bold.text-4xl.border-primary');
    if (await selectedCard.count() > 0) {
      return await selectedCard.getAttribute('title');
    }
    return null;
  }

  async revealVotes() {
    await this.page.click('button:has-text("Reveal")');
  }

  async nextRound() {
    await this.page.click('button:has-text("Next")');
  }

  async restartRound() {
    await this.page.click('button:has-text("Restart")');
  }

  async getVotesInRoom(): Promise<string[]> {
    const voteCards = this.page.locator('div.px-4.py-4.border-2.rounded-lg.cursor-pointer.font-bold.text-4xl');
    const votes: string[] = [];
    const count = await voteCards.count();
    
    for (let i = 0; i < count; i++) {
      const vote = await voteCards.nth(i).getAttribute('title');
      if (vote) votes.push(vote);
    }
    
    return votes;
  }

  async getUserVoteStatus(username: string): Promise<string> {
    const userElement = this.page.locator(`text=${username}`).first();
    const parent = userElement.locator('..');
    
    if (await parent.locator('text=voted').count() > 0) {
      return 'voted';
    }
    return 'not_voted';
  }

  async isRevealButtonVisible(): Promise<boolean> {
    return await this.page.locator('button:has-text("Reveal")').isVisible();
  }

  async isNextButtonVisible(): Promise<boolean> {
    return await this.page.locator('button:has-text("Next")').isVisible();
  }

  async isRestartButtonVisible(): Promise<boolean> {
    return await this.page.locator('button:has-text("Restart")').isVisible();
  }

  async waitForReveal() {
    await this.page.waitForSelector('div.px-4.py-4.border-2.rounded-lg.cursor-pointer.font-bold.text-4xl:not(.border-gray-300)', { timeout: 10000 });
  }

  async getRevealedVotes(): Promise<{ user: string; vote: string }[]> {
    const revealedVotes: { user: string; vote: string }[] = [];
    
    // This would need to be adapted based on the actual DOM structure
    // when votes are revealed
    const userElements = await this.page.locator('[data-testid="user-vote"]').all();
    
    for (const element of userElements) {
      const user = await element.locator('[data-testid="username"]').textContent();
      const vote = await element.locator('[data-testid="vote-value"]').textContent();
      if (user && vote) {
        revealedVotes.push({ user: user.trim(), vote: vote.trim() });
      }
    }
    
    return revealedVotes;
  }

  async isAdmin(): Promise<boolean> {
    // Check if admin toolbar is visible
    return await this.page.locator('div.toolbar').isVisible();
  }

  async getRoomInfo(): Promise<{ name: string; round: string }> {
    const headerElement = this.page.locator('div[class*="headerChip"]').first();
    const text = await headerElement.textContent();
    
    // Parse room name and round from header text
    // This would need to be adapted based on actual format
    const parts = text?.split(' • ') || ['', '1'];
    
    return {
      name: parts[0] || '',
      round: parts[1] || '1'
    };
  }
}