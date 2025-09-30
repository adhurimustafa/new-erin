import { HeroHarvey } from "@/components/HeroHarvey";
import { ClientsSection } from "@/components/ClientsSection";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { SolutionsSection } from "@/components/SolutionsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { SecuritySection } from "@/components/SecuritySection";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroHarvey />
      <ClientsSection />
      <PlatformFeatures />
      <SolutionsSection />
      <HowItWorks />
      <Process />
      <SecuritySection />
      <Pricing />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
