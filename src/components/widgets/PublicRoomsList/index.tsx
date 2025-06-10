import "server-only";

import { roomsService } from "@/backend/services";
import { Dictionary, I18nLocale } from "@/i18n/get-dictionary";
import { ClientRoom } from "@/types";
import { DoorClosedIcon, DoorOpenIcon } from "lucide-react";
import Link from "next/link";
import styles from "./PublicRoomsList.module.css";

type Props = {
  lang: I18nLocale;
  i18n: Dictionary["pages"]["home"]["joinRoomForm"];
};

const PublicRoomsList: React.FC<Props> = async ({ lang, i18n }) => {
  const roomsToJoin: ClientRoom[] = await roomsService.getPublicRooms();

  return (
    <div>
      <div className="px-6 py-3">
        <h1 className="text-center font-semibold text-lg">{i18n.header}</h1>
      </div>
      <hr className="w-full" />
      <ul className="flex flex-col">
        {roomsToJoin.map((room) => (
          <Link href={`/${lang}/rooms/${room.uuid}/join`} key={room.uuid}>
            <li className={styles.roomItem}>
              <div className={styles.icon}>
                <DoorClosedIcon />
                <DoorOpenIcon />
              </div>
              <div className={styles.roomName}>{room.name}</div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export { PublicRoomsList };

