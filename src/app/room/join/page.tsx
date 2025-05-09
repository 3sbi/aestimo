import "server-only";

import JoinRoomForm from "@/components/widgets/JoinRoomForm";
import { i18nConfig } from "@/i18n/get-dictionary";

export default async function Page() {
  return (
    <div className="card">
      <JoinRoomForm locale={i18nConfig.defaultLocale} />
    </div>
  );
}
