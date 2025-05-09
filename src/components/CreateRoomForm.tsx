import "server-only";

import { I18nLocale } from "@/i18n/get-dictionary";

const CreateRoomForm: React.FC<{ locale: I18nLocale }> = ({ locale }) => {
  return (
    <form>
      <input id="name" type="text" />
      <input type="range" />
    </form>
  );
};

export default CreateRoomForm;
