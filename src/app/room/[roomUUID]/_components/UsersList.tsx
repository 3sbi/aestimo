import "server-only";

import { Rooms, Users } from "@/database/services";

type UserCardProps = Props & {
  roomId: number;
  votingRound: number;
  user: { name: string; id: number };
};

const UserCard: React.FC<UserCardProps> = async ({
  user,
  roomId,
  votingRound,
}) => {
  const voted: boolean = await Users.hasVoted(user.id, roomId, votingRound);

  return (
    <div>
      <h2>{user.name}</h2>
      {voted ? "🗳️" : "🤔"}
    </div>
  );
};

type Props = {
  roomId: number;
  votingRound: number;
};

const UsersList: React.FC<Props> = async ({ roomId, votingRound }) => {
  const users = await Rooms.getUsers(roomId);

  return (
    <div className="card">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          roomId={roomId}
          votingRound={votingRound}
        />
      ))}
    </div>
  );
};

export default UsersList;
