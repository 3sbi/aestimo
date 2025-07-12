export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export class UserNotAdminError extends Error {
  constructor() {
    super("User not admin");
    this.name = "UserNotAdminError";
  }
}
