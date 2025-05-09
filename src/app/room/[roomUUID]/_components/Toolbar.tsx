import "server-only";

import React from "react";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";

const Toolbar: React.FC<{ locale: I18nLocale }> = ({ locale }) => {
  const dictionary = getDictionary(locale);
  const i18n = dictionary.room.toolbar;

  function onClickReveal() {}

  return (
    <header className="toolbar">
      <button className="btn" onClick={onClickReveal}>
        {i18n.reveal}
      </button>
      <button className="btn">{i18n.restart}</button>
      <button className="btn">{i18n.delete}</button>
      <button className="btn">{i18n.leave}</button>
      <button className="btn">{i18n.invite}</button>
    </header>
  );
};

export default Toolbar;
