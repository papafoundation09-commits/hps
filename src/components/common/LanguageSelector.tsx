import React from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" }
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
        title={t("language")}
        id="language-selector-btn"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline text-xs">{currentLang.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs text-slate-200 animate-fadeIn">
          <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
            {t("language")}
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
                i18n.language === lang.code
                  ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {i18n.language === lang.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
