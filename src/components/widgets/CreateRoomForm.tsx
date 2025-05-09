import "server-only";

import { Input } from "@/components/Input";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import Button from "@/components/Button";

type Props = {
  locale: I18nLocale;
};

const CreateRoomForm: React.FC<Props> = ({ locale }) => {
  const dictionary = getDictionary(locale);
  const i18n = dictionary.createRoomForm;
  return (
    <form action="/api/rooms/create" method="post">
      <Input type="text" label={i18n.username} />
      <Button variant="primary">{i18n.create}</Button>
    </form>
  );
};

export default CreateRoomForm;
