import { Card, CardBody } from "@nextui-org/card";
import React, { Suspense } from "react";
import CardSkeleton from "@/app/CardSkeleton";
// import PowerBiComponent from "./PowerBiComponent";
import dynamic from "next/dynamic";
const DynamicPowerBiComponent = dynamic(() => import("./PowerBiComponent"), {
  ssr: false,
});

const Page = () => {
  return (
    <Card className="mx-5" style={{ height: "90vh", minHeight: "900px" }}>
      <CardBody>
        <Suspense fallback={<CardSkeleton />}>
          <DynamicPowerBiComponent />
        </Suspense>
      </CardBody>
    </Card>
  );
};

export default Page;
