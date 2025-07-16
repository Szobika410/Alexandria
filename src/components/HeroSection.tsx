
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
          Könyveid új otthont találnak, <br className="hidden sm:block" />
          <span className="text-orange-600">új történetek várnak rád</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
          Cserélj, vásárolj és adj el könyveket a magyar-román közösségben. 
          Csatlakozz könyvklubokhoz és fedezd fel új olvasnivalókat.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-6 md:px-8 w-full sm:w-auto">
            Böngészés kezdése
          </Button>
          <Button size="lg" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 px-6 md:px-8 w-full sm:w-auto">
            Könyv hirdetése
          </Button>
        </div>
        
        <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto text-center">
          <div>
            <div className="text-xl md:text-2xl font-bold text-orange-600">15K+</div>
            <div className="text-xs md:text-sm text-gray-600">Aktív könyv</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold text-orange-600">3.2K</div>
            <div className="text-xs md:text-sm text-gray-600">Sikeres csere</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold text-orange-600">850</div>
            <div className="text-xs md:text-sm text-gray-600">Könyvklub</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
