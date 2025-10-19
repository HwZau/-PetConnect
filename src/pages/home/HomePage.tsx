import HeroSection from "../../components/home/HeroSection";
import SearchSection from "../../components/home/SearchSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import ServicesSection from "../../components/home/ServicesSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
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
