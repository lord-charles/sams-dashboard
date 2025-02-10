"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Akuol Malong",
    role: "Student, Juba Day Secondary School",
    quote:
      "The new facilities and dedicated teachers have transformed my learning experience. I'm now more confident in my abilities and excited about my future.",
    image: "/img/mogei.png",
  },
  {
    id: 2,
    name: "Deng Kiir",
    role: "Parent",
    quote:
      "I've seen a remarkable improvement in my child's academic performance and overall enthusiasm for learning. The school's commitment to quality education is commendable.",
    image: "/img/mogei.png",
  },
  {
    id: 3,
    name: "Mary Ayen",
    role: "Teacher, Buluk A Primary School",
    quote:
      "The recent investments in our school have provided us with better resources to teach effectively. It's heartening to see the positive impact on our students.",
    image: "/img/mogei.png",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoSliding) {
      intervalId = setInterval(() => {
        nextTestimonial();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoSliding, nextTestimonial]);

  const handleMouseEnter = () => setIsAutoSliding(false);
  const handleMouseLeave = () => setIsAutoSliding(true);

  return (
    <section className="py-5 bg-gradient-to-b from-primary/10 to-primary/5">
      <div className="">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">
          Voices from Our Community
        </h2>
        <div
          className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center mb-6">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="rounded-full mb-4 md:mb-0 md:mr-6"
                        />
                        <div className="text-center md:text-left">
                          <h3 className="font-semibold text-xl text-primary">
                            {testimonial.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg italic text-foreground">
                        {testimonial.quote}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
