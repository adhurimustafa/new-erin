import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { PublicsCibles } from "@/components/PublicsCibles";
import { Process } from "@/components/Process";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <PublicsCibles />
      <Process />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
