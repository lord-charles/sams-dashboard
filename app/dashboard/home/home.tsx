"use client";
import React from "react";
import HeroSection from "./components/HeroSection";
import Footer from "./components/footer";
import Testimonials from "./testimonials";
import SouthSudanMap from "./south-sudan-map";
import { EducationStats } from "./statcards";

const Home = () => {
  return (
    <div className="space-y-10">
      <HeroSection />
      {/* <DirectGrantsSection />
      <PupilAgeDistribution />
      <ProjectStatus /> */}
      <EducationStats />
      <SouthSudanMap />
      <Testimonials />

      <Footer />
    </div>
  );
};

export default Home;
