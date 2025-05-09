import "server-only";

import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";

const JoinRoomForm: React.FC<{ locale: I18nLocale }> = ({ locale }) => {
  const dictionary = getDictionary(locale);
  const i18n = dictionary.joinRoomForm;
  
  return (
    <form action="/api/" method="POST">
      <label htmlFor="uuid">{i18n.uuid}</label>
      <input id="uuid" type="text" />

      <label htmlFor="username">{i18n.username}</label>
      <input id="username" type="text" />

      <button type="submit">{i18n.join}</button>
    </form>
  );
};

export default JoinRoomForm;
