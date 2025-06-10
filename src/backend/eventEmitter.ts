import { Room, User } from "@/types";
import { Event } from "@/types/EventData";

export type SseClient = {
  UUID: User["uuid"];
  id: User["id"];
  roomUUID: Room["uuid"];
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
  broadcast(roomUUID: string, data: Event, initiatorUUID?: string) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    const clientsInRoom = this.clients.filter(
      (client) => client.roomUUID === roomUUID && client.UUID !== initiatorUUID
    );
    clientsInRoom.forEach((client) => client.send(payload));
  }
}

const sseStore = new SseStore();

export { sseStore };
