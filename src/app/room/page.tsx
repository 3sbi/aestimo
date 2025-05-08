import "server-only";

const CreateRoomForm = () => {
  return (
    <div>
      <input id="name" type="text" />
      <input type="range" />
    </div>
  );
};

const JoinRoomForm = () => {
  return (
    <div>
      <label htmlFor=""></label>
      <input id="uuid" type="text" />
      <input id="name" type="text" />
      <button></button>
    </div>
  );
};

export default async function Page() {}
