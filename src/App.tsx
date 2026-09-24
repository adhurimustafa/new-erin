import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reserver from "./pages/Reserver";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import { LanguageProvider } from "./i18n";
import { lazy, Suspense } from "react";

// Private Studio: loaded in its own chunk so the public site stays light.
const StudioApp = lazy(() => import("./studio/StudioApp"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reserver" element={<Reserver />} />
          <Route path="/merci" element={<ThankYou />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/studio/*" element={<Suspense fallback={null}><StudioApp /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
