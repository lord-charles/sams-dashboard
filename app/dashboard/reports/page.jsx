"use client";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import React from "react";
import NextImage from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <Card className="mx-5">
      <CardBody>
        <Card
          as={Link}
          href="/dashboard/power-bi"
          className="w-1/3"
          isPressable
        >
          <CardHeader>Self-service Dashboard</CardHeader>
          <CardBody>
            <Image
              as={NextImage}
              width={300}
              height={300}
              src="/img/placeholder.png"
              alt="Reports dashboard for GESS South Sudan"
            />
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};

export default Page;
