import "server-only";

import { UserRepository } from "@/backend/repositories";
import { getSession } from "@/backend/session";
import { JoinRoomForm } from "@/components/widgets/JoinRoomForm";
import { getDictionary, I18nLocale } from "@/i18n/getDictionary";
import { Room, User } from "@/types";
import { notFound, redirect, RedirectType } from "next/navigation";

type Props = {
  params: Promise<{ roomSlug: string; lang: I18nLocale }>;
};

export default async function Page(props: Props) {
  const { roomSlug, lang } = await props.params;
  const session = await getSession();
  if (session && session.roomSlug && session.userId) {
    const res = await UserRepository.getById(session.userId);
    const user: User | undefined = res?.users;
    const room: Room | undefined | null = res?.rooms;

    if (room?.private) {
      return notFound();
    }

    if (
      session.userId === user?.id &&
      roomSlug === session.roomSlug &&
      roomSlug === room?.slug
    ) {
      redirect(`/rooms/${roomSlug}`, RedirectType.replace);
    }
  }

  const dictionary = getDictionary(lang);
  const i18n = dictionary.pages.home.joinRoomForm;

  return (
    <div className="m-auto card w-[420px] flex flex-col">
      <div className="px-6 py-3">
        <h1 className="text-center font-semibold text-xl">{i18n.header}</h1>
      </div>
      <hr className="w-full" />
      <JoinRoomForm i18n={i18n} roomSlug={roomSlug} />
    </div>
  );
}
