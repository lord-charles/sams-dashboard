"use client";
import React from "react";
import HeroSection from "./components/HeroSection";
import Footer from "./components/footer";
import Testimonials from "./testimonials";
import SouthSudanMap from "./south-sudan-map";
import EducationStatsDashboard from "./statcards";

const Home = ({ schoolStats, enrollmentData }: { schoolStats: any; enrollmentData: any }) => {
  return (
    <div className="space-y-0">
      <HeroSection />
      {/* <DirectGrantsSection />
      <PupilAgeDistribution />
      <ProjectStatus /> */}
      <EducationStatsDashboard  schoolsData={schoolStats} enrollmentData={enrollmentData} />
      <Testimonials schoolsData={schoolStats}/>

      <SouthSudanMap />
      <Footer />
    </div>
  );
};

export default Home;
