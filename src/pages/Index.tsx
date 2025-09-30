import { Hero } from "@/components/Hero";
import { TrustIndicators } from "@/components/TrustIndicators";
import { ValueProposition } from "@/components/ValueProposition";
import { Modules } from "@/components/Modules";
import { Process } from "@/components/Process";
import { Benefits } from "@/components/Benefits";
import { Testimonials } from "@/components/Testimonials";
import { ForWho } from "@/components/ForWho";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrustIndicators />
      <ValueProposition />
      <Modules />
      <Process />
      <Benefits />
      <Testimonials />
      <ForWho />
      <Pricing />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
