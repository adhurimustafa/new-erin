import { Card, CardContent } from "@/components/ui/card";
import { Globe, MessageSquare, Lightbulb, Users } from "lucide-react";
import { motion } from "framer-motion";
import serviceWeb from "@/assets/service-web.png";
import serviceChatbot from "@/assets/service-chatbot.png";
import serviceConseil from "@/assets/service-conseil.png";
import serviceAssistance from "@/assets/service-assistance.png";

const services = [
  {
    icon: Globe,
    image: serviceWeb,
    title: "Création de sites web assistée par IA",
    description: "Sites modernes et performants créés avec l'alliance parfaite entre expertise humaine et puissance de l'intelligence artificielle. Rapide, efficace, et sur mesure."
  },
  {
    icon: MessageSquare,
    image: serviceChatbot,
    title: "Chatbots & automatisations intelligentes",
    description: "Transformez votre service client avec des chatbots intelligents et des automatisations qui simplifient vos processus. Disponibles 24/7, efficaces et personnalisés."
  },
  {
    icon: Lightbulb,
    image: serviceConseil,
    title: "Conseil & accompagnement IA",
    description: "Découvrez comment l'IA peut transformer votre activité. Conseil stratégique, formation et accompagnement sur mesure pour intégrer l'IA dans votre quotidien professionnel."
  },
  {
    icon: Users,
    image: serviceAssistance,
    title: "Assistance personnalisée",
    description: "Un accompagnement humain et bienveillant pour tous : particuliers, professionnels, seniors. Apprenez à maîtriser les outils digitaux et l'IA en toute confiance."
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-24 px-4 relative overflow-hidden bg-midnight">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-purple via-golden to-turquoise bg-clip-text text-transparent">
              Nos Services
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-2xl mx-auto">
            La synergie Humain + IA au service de vos projets
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full glass-card border-purple/30 overflow-hidden">
                  <CardContent className="p-6">
                    {/* Image */}
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple/20 to-golden/20 flex items-center justify-center mb-4 shadow-glow">
                      <Icon className="w-6 h-6 text-golden" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-accentlight mb-3">
                      {service.title}
                    </h3>
                    <p className="text-accentlight/70 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Philosophy section */}
        <motion.div
          className="mt-16 p-8 rounded-2xl glass-card border-golden/30 max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-center mb-4 gradient-tadam">
            Notre philosophie : Human + IA
          </h3>
          <p className="text-accentlight/80 text-center leading-relaxed">
            Nous croyons en la magie qui opère quand l'humain et l'intelligence artificielle 
            travaillent ensemble. L'IA apporte la rapidité et l'efficacité, l'humain apporte 
            l'empathie, la créativité et le bon sens. Ensemble, nous créons des solutions 
            <span className="text-golden font-semibold"> simples, accessibles et efficaces </span>
            pour tous les âges et tous les besoins.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
