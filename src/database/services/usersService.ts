import { VoteRepository, UserRepository } from "@/database/repositories";

class Users {
  async hasVoted(
    userId: number,
    roomId: number,
    round: number
  ): Promise<boolean> {
    const votes = await VoteRepository.get({ userId, roomId, round });
    return votes.length > 0;
  }

  async getUsersByRoomId(roomId: number) {
    const users = await UserRepository.getByRoomId(roomId);
    return users;
  }
}

export default new Users();
