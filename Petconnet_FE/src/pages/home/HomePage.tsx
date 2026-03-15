import HeroSection from "../../components/home/HeroSection";
import SearchSection from "../../components/home/SearchSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import ServicesSection from "../../components/home/ServicesSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import HowItWorksSection from "../../components/home/HowItWorksSection";
import StatsSection from "../../components/home/StatsSection";
import PetCareTipsSection from "../../components/home/PetCareTipsSection";
import TestimonialsReviewsSection from "../../components/home/TestimonialsReviewsSection";
import FAQSection from "../../components/home/FAQSection";
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
      <FeaturesSection />
      <SearchSection />
      <ServicesSection />
      <HowItWorksSection />
      <StatsSection />
      <PetCareTipsSection />
      <TestimonialsReviewsSection />
      <FAQSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
