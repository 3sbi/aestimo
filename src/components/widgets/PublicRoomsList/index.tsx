import "server-only";

import { roomsService } from "@/backend/services";
import { Dictionary, I18nLocale } from "@/i18n/getDictionary";
import { ClientRoom } from "@/types";
import { DoorClosedIcon, DoorOpenIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import styles from "./PublicRoomsList.module.css";

type Props = {
  lang: I18nLocale;
  i18n: Dictionary["pages"]["home"]["joinRoomForm"];
};

const PublicRoomsList: React.FC<Props> = async ({ lang, i18n }) => {
  const roomsToJoin: ClientRoom[] = await roomsService.getPublicRooms();

  function renderRoomsList() {
    if (roomsToJoin.length === 0) {
      return (
        <div className={styles.empty}>
          <SearchXIcon size={32} />
          <h5>{i18n.empty}</h5>
        </div>
      );
    }

    return (
      <ul className="flex flex-col">
        {roomsToJoin.map((room) => (
          <Link href={`/${lang}/rooms/${room.slug}/join`} key={room.slug}>
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
    );
  }

  return (
    <div>
      <div className="px-6 py-3">
        <h1 className="text-center font-semibold text-lg">{i18n.header}</h1>
      </div>
      <hr className="w-full" />
      {renderRoomsList()}
    </div>
  );
};

export { PublicRoomsList };
