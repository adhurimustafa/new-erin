import { useLanguage, type Language } from "@/i18n";

const options: { code: Language; label: string }[] = [
  { code: "sq", label: "SQ" },
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-switcher" role="group" aria-label={t.nav.language}>
      {options.map(({ code, label }) => (
        <button key={code} type="button" onClick={() => setLanguage(code)} aria-pressed={language === code} className={language === code ? "active" : ""}>
          {label}
        </button>
      ))}
    </div>
  );
}