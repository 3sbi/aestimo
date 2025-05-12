import { VoteRepository } from "@/database/repositories";

class Users {
  async hasVoted(
    userId: number,
    roomId: number,
    round: number
  ): Promise<boolean> {
    const votes = await VoteRepository.get({ userId, roomId, round });
    return votes.length > 0;
  }
}

export default new Users();
