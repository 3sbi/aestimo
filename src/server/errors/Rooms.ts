export class RoomNotFoundError extends Error {
  constructor() {
    super(`Room not found`);
    this.name = "RoomNotFoundError";
  }
}

export class RoomIsPrivateError extends Error {
  constructor() {
    super(`Room not found`);
    this.name = "RoomIsPrivate";
  }
}

