export type SseClient = {
  roomUUID: string;
  UUID: string;
  send: (data: string) => void;
};

class SseStore {
  clients: SseClient[] = [];

  addClient(client: SseClient) {
    this.clients.push(client);
  }

  removeClient(client: SseClient) {
    const index = this.clients.indexOf(client);
    if (index !== -1) this.clients.splice(index, 1);
  }

  /**
   * event should be send to only to users
   * that are in the same room as event emitter source
   *
   */
  broadcast(
    roomUUID: string,
    data: { type: string; data: Record<string, unknown> | Array<unknown> },
    initiatorUUID?: string
  ) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    this.clients
      .filter((c) => c.roomUUID === roomUUID)
      .filter((c) => c.UUID !== initiatorUUID)
      .forEach((c) => c.send(payload));
  }
}

const sseStore = new SseStore();

export { sseStore };
