import { Room, User } from "@/types";
import { Event } from "@/types/EventData";

export type SseClient = {
  id: User["id"];
  roomSlug: Room["slug"];
  send: (data: string) => void;
};

class SseStore {
  private clients: SseClient[] = [];

  public addClient(client: SseClient) {
    this.clients.push(client);
  }

  public isConnected(id: SseClient["id"]): boolean {
    return this.clients.find((u) => u.id === id) !== undefined;
  }

  public removeClient(client: SseClient) {
    const index = this.clients.indexOf(client);
    if (index !== -1) this.clients.splice(index, 1);
  }

  /**
   * event should be send to only to users
   * that are in the same room as event emitter source
   *
   */
  public broadcast(roomSlug: string, data: Event, initiatorId?: number) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    const clientsInRoom = this.clients.filter(
      (client) => client.roomSlug === roomSlug && client.id !== initiatorId
    );
    clientsInRoom.forEach((client) => client.send(payload));
  }
}

const sseStore = new SseStore();

export { sseStore };
