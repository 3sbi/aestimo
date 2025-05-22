"use client";

import React from "react";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";

type Props = {
  i18n: {
    reveal: string;
    delete: string;
    restart: string;
    leave: string;
    invite: string;
    history: string;
  };
};

const Toolbar: React.FC<Props> = ({ i18n }) => {

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
