"use client";

import React from "react";

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

  function onClickRestart() {}

  function onClickDelete() {}

  function onClickLeave() {}

  function onClickInvite() {
    // navigator.clipboard.writeText();
  }

  return (
    <header className="toolbar">
      <button className="btn" onClick={onClickReveal}>
        {i18n.reveal}
      </button>
      <button className="btn" onClick={onClickRestart}>
        {i18n.restart}
      </button>
      <button className="btn" onClick={onClickDelete}>
        {i18n.delete}
      </button>
      <button className="btn" onClick={onClickLeave}>
        {i18n.leave}
      </button>
      <button className="btn" onClick={onClickInvite}>
        {i18n.invite}
      </button>
    </header>
  );
};

export default Toolbar;
