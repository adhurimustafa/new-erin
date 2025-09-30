import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Process />
      <Benefits />
      <Pricing />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
