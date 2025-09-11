import {
  Navbar,
  HeroSection,
  SearchSection,
  FeaturesSection,
  ServicesSection,
  TestimonialsSection,
  Footer,
} from "../../components/common";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
