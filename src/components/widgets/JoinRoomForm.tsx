import "server-only";

import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import Form from "next/form";
import { Button } from "../Button";
import { Input } from "../Input";

type Props = { locale: I18nLocale };

const JoinRoomForm: React.FC<Props> = ({ locale }) => {
  const dictionary = getDictionary(locale);
  const i18n = dictionary.joinRoomForm;

  return (
    <Form action="/api/rooms/join">
      <Input id="uuid" type="text" label={i18n.uuid} />
      <Input id="username" type="text" label={i18n.username} />
      <Button variant="primary" type="submit" className="mt-4">
        {i18n.join}
      </Button>
    </Form>
  );
};

export default JoinRoomForm;
