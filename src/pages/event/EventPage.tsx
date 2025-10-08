import { Navbar, Footer } from "../../components/common";
import EventHeroSection from "../../components/events/EventHeroSection";
import EventListSection from "../../components/events/EventListSection";

const EventPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <EventHeroSection />
      <EventListSection />
      <Footer />
    </div>
  );
};

export default EventPage;
