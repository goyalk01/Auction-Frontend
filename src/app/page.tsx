import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { StatsSection } from "../components/landing/StatsSection";
import { AboutSection } from "../components/landing/AboutSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { TimelineSection } from "../components/landing/TimelineSection";
import { FranchisesSection } from "../components/landing/FranchisesSection";
import { RulesSection } from "../components/landing/RulesSection";
import { Footer } from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <HowItWorksSection />
      <TimelineSection />
      <FranchisesSection />
      <RulesSection />
      <Footer />
    </main>
  );
}
