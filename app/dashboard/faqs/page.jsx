"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

const Page = () => {
  const accordionItems = [
    { title: "What is Anna Fi Inni?", description: "Hello there" },
    { title: "Which state has the most students?", description: "Hello there" },
    {
      title: "Which state benefited more than Cash Transfers for girls?",
      description: "Hello there",
    },
    {
      title: "Where can I download the 2016 Cash Transfers TSV?",
      description: "Hello there",
    },
    { title: "What does SBRT Stand For?", description: "Hello there" },
    {
      title: "How do you upload a CSV file to the system?",
      description: "Hello there",
    },
    { title: "Where can I get teachers Data?", description: "Hello there" },
    {
      title: "Where can I get Student Enrolment Data?",
      description: "Hello there",
    },
    { title: "Who Funds Sssams?", description: "Hello there" },
    {
      title: "Where can I download the 2022 Enrollment CSV?",
      description: "Hello there",
    },
    { title: "What is GESS?", description: "Hello there" },
    {
      title: "What happens when you don't reach the Attendance Threshold?",
      description: "Hello there",
    },
  ];
  return (
    <Card className="mx-5 text-xs">
      <CardBody>
        <div className="w-full flex justify-center items-center">
          <Image
            as={NextImage}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
            src="http://34.122.44.159/_next/image?url=%2Fimg%2Ffp_Juba%20Model%20Primary%20school.jpeg&w=640&q=75"
            alt="Students learning for GESS South Sudan"
          />
        </div>
        <h4 className="my-3 text-lg font-bold">FAQs</h4>

        <Accordion selectionMode="multiple">
          {accordionItems?.map((item, index) => {
            return (
              <AccordionItem
                key={index}
                aria-label={item?.title}
                startContent={
                  <Avatar
                    isBordered
                    color="primary"
                    radius="full"
                    src="/img/mogei.png"
                  />
                }
                title={item?.title}
              >
                {item?.description}
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardBody>
    </Card>
  );
};

export default Page;
