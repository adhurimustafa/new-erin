import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";
export default function NotFound() { const { t } = useLanguage(); return <main className="centered-page"><p className="eyebrow">404</p><h1>{t.notFound.title}</h1><p>{t.notFound.text}</p><Button asChild><a href="/">{t.notFound.home}</a></Button></main>; }