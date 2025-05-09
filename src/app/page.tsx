"use client";

import CreateRoomForm from "@/components/CreateRoomForm";
import JoinRoomForm from "@/components/JoinRoomForm";
import { i18nConfig } from "@/i18n/get-dictionary";

export default function Home() {
  return (
    <div>
      <CreateRoomForm locale={i18nConfig.defaultLocale} />
      <JoinRoomForm locale={i18nConfig.defaultLocale} />
    </div>
  );
}
