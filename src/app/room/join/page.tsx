import "server-only";

import JoinRoomForm from "@/components/JoinRoomForm";
import { i18nConfig } from "@/i18n/get-dictionary";

export default async function Page() {
  return <JoinRoomForm locale={i18nConfig.defaultLocale} />;
}
