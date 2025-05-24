import "server-only";

import JoinRoomForm from "@/components/widgets/JoinRoomForm";
import { i18nConfig } from "@/i18n/get-dictionary";

type Props = {
  params: Promise<{ roomUUID: string }>;
};

export default async function Page(props: Props) {
  const { roomUUID } = await props.params;
  return (
    <div className="card">
      <JoinRoomForm locale={i18nConfig.defaultLocale} roomUUID={roomUUID} />
    </div>
  );
}
