import "server-only";

import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { Button } from "../Button";
import { Input } from "../Input";

type Props = { locale: I18nLocale; roomUUID: string };

const JoinRoomForm: React.FC<Props> = ({ locale, roomUUID }) => {
  const dictionary = getDictionary(locale);
  const i18n = dictionary.joinRoomForm;

  return (
    <form action={`/api/rooms/${roomUUID}/join`} method="POST">
      <Input id="username" type="text" label={i18n.username} />
      <Button variant="primary" type="submit" className="mt-4">
        {i18n.join}
      </Button>
    </form>
  );
};

export default JoinRoomForm;
