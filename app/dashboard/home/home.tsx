"use client";
import React from "react";
import HeroSection from "./components/HeroSection";
import Footer from "./components/footer";
import Testimonials from "./testimonials";
import SouthSudanMap from "./south-sudan-map";
import EducationStatsDashboard from "./statcards";

const Home = ({ learnerStats, schoolStats }: { learnerStats: any; schoolStats: any }) => {
  return (
    <div className="space-y-10 ">
      <HeroSection />
      {/* <DirectGrantsSection />
      <PupilAgeDistribution />
      <ProjectStatus /> */}
      <EducationStatsDashboard learnersData={learnerStats} schoolsData={schoolStats} />
      <Testimonials schoolsData={schoolStats}/>

      <SouthSudanMap />
      <Footer />
    </div>
  );
};

export default Home;
