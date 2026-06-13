import Motion from "@/components/aero/ui/Motion";
import AeroNav from "@/components/aero/AeroNav";
import Hero from "@/components/aero/Hero";
import TrustMetrics from "@/components/aero/TrustMetrics";
import Services from "@/components/aero/Services";
import Aircraft from "@/components/aero/Aircraft";
import Destinations from "@/components/aero/Destinations";
import WhyUs from "@/components/aero/WhyUs";
import TimeSaved from "@/components/aero/TimeSaved";
import Process from "@/components/aero/Process";
import QuoteForm from "@/components/aero/QuoteForm";
import Faq from "@/components/aero/Faq";
import FinalCTA from "@/components/aero/FinalCTA";
import AeroFooter from "@/components/aero/AeroFooter";
import WhatsAppFloat from "@/components/aero/WhatsAppFloat";
import LandingRuntime from "@/components/aero/ui/LandingRuntime";
import { SECTIONS } from "@/lib/aero";

export default function Home() {
  return (
    <div className="aero-root min-h-screen">
      <LandingRuntime />
      <Motion>
        <AeroNav />
        <main>
          <Hero />
          <TrustMetrics />
          <Services />
          <Aircraft />
          <Destinations />
          <WhyUs />
          {SECTIONS.timeCalculator && <TimeSaved />}
          <Process />
          <QuoteForm />
          {SECTIONS.faq && <Faq />}
          <FinalCTA />
        </main>
        <AeroFooter />
        <WhatsAppFloat />
      </Motion>
    </div>
  );
}
