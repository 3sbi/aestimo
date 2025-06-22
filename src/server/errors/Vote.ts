export class VoteNotFoundError extends Error {
  constructor() {
    super(`Vote not found`);
    this.name = "VoteNotFoundError";
  }
}
