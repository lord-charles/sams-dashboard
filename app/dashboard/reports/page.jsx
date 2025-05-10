import { Card, CardBody } from "@nextui-org/card";
import React, { Suspense } from "react";
import CardSkeleton from "@/app/CardSkeleton";
// import PowerBiComponent from "./PowerBiComponent";
import dynamic from "next/dynamic";
const DynamicPowerBiComponent = dynamic(() => import("../power-bi/PowerBiComponent"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <Suspense fallback={<CardSkeleton />}>
        <DynamicPowerBiComponent />
      </Suspense>
    </div>
  );
};

export default Page;
