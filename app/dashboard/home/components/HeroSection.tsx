"use client";
import React from "react";
import Image from "next/image";

const ImageBackground = () => {
  return (
    <div className="relative h-[40vh] overflow-hidden ">
      <Image
        src="/img/banners/banner4.jpg"
        alt="Ana Fii Inni"
        layout="fill"
        objectFit="cover"
        className=""
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Ana Fii Inni</h1>
          <p className="text-xl md:text-2xl mb-8">
            &ldquo;I am here!&quot; - Transforming Education in South Sudan
          </p>
        </div>
      </div>
    </div>
  );
};

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/20 to-background  overflow-hidden">
        <ImageBackground />
    </section>
  );
}
