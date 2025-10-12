import {
  Navbar,
  HeroSection,
  SearchSection,
  FeaturesSection,
  ServicesSection,
  TestimonialsSection,
  Footer,
} from "../../components/common";
import { useScrollToTop } from "../../hooks";

const HomePage = () => {
  // Scroll to top when page loads
  useScrollToTop();
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
