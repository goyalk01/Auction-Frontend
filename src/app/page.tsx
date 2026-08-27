import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { FranchisesSection } from "../components/landing/FranchisesSection";
import { Footer } from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FranchisesSection />
      <Footer />
    </main>
  );
}
