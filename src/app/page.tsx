import "server-only";

import { PREDEFINED_VOTE_TYPES } from "@/backend/consts/predefinedVoteTypes";
import CreateRoomForm from "@/components/widgets/CreateRoomForm";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const lang: I18nLocale = cookieStore.get("lang")?.value as I18nLocale;
  const i18n = getDictionary(lang);
  return (
    <div className="m-auto card w-[400px] h-[400px] flex flex-col">
      <CreateRoomForm
        i18n={i18n.createRoomForm}
        predefinedVoteTypes={PREDEFINED_VOTE_TYPES}
      />
    </div>
  );
}
