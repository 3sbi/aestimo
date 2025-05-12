import "server-only";

import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { Input } from "../Input";
import Button from "../Button";

const JoinRoomForm: React.FC<{ locale: I18nLocale }> = ({ locale }) => {
  const dictionary = getDictionary(locale);
  const i18n = dictionary.joinRoomForm;

  return (
    <form action="/api/rooms/" method="POST">
      <Input id="uuid" type="text" label={i18n.uuid} />
      <Input id="username" type="text" label={i18n.username} />
      <Button variant="primary" type="submit" className="mt-4">
        {i18n.join}
      </Button>
    </form>
  );
};

export default JoinRoomForm;
