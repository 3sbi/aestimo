"use client";

import type { i18nConfig, I18nLocale } from "@/i18n/get-dictionary";
import { CheckIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./LocaleSwitcher.module.css";

type Props = {
  i18nConfig: typeof i18nConfig;
  languageNames: Record<string, string>;
};

const LocaleSwitcher: React.FC<Props> = ({ languageNames, i18nConfig }) => {
  const [opened, setOpened] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentLanguage = (): I18nLocale => {
    const lang = pathname.split("/").filter((x) => !!x)[0];
    if (!i18nConfig.locales.includes(lang as I18nLocale)) {
      return i18nConfig.defaultLocale;
    }
    return lang as I18nLocale;
  };

  const currentLanguage = getCurrentLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        modalRef.current &&
        event.target &&
        !btnRef.current?.contains(target) &&
        !modalRef.current.contains(target)
      ) {
        setOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  function onChange(lang: I18nLocale) {
    if (!pathname) {
      router.push("/");
      return;
    }
    const segments = pathname.split("/");
    segments[1] = lang;
    document.documentElement.lang = lang;
    router.push(segments.join("/"));
  }

  return (
    <div className={styles.langSwitch}>
      <div
        ref={btnRef}
        className={styles.langSwitchBtn}
        onClick={() => setOpened(!opened)}
        title={
          languageNames[currentLanguage] ??
          languageNames[i18nConfig.defaultLocale]
        }
      >
        {currentLanguage.toUpperCase()}
      </div>
      {opened && (
        <div className={styles.langOptionsPopup} ref={modalRef}>
          {i18nConfig.locales.map((option: I18nLocale) => {
            const title = option.toUpperCase();
            return (
              <span
                title={title}
                className={styles.langOption}
                key={option}
                onClick={() => onChange(option)}
              >
                {languageNames[option]}
                {option === currentLanguage && <CheckIcon />}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcher;
