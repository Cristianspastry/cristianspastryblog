import React from "react";
import Button from "../ui/Button";

const HeroSection: React.FC = () => (
   <section className="py-16 text-center bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-serif text-blue-900 mb-4">
            {"Ogni dolce ha un’anima. Io racconto la sua storia, un morso alla volta."}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {"Ricette sincere, passione artigianale e il profumo di un sogno che lievita ogni giorno."}
          </p>
          <Button href="/ricette">
            Scopri le mie ricette
          </Button>
        </div>
      </section>
);

export default HeroSection; 