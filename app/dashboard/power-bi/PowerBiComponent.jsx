"use client";
import React, { useEffect, useState } from "react";
import PowerbiEmbedded from "nextjs-powerbi";
// import dynamic from "next/dynamic";
// const PowerbiEmbedded = dynamic(() => import("nextjs-powerbi"));

const PowerBiComponent = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <>
      <iframe title="SAMS v53" width="1140" height="700.25" src="https://app.powerbi.com/reportEmbed?reportId=c319549c-0e70-4098-8532-483dec1e7823&autoAuth=true&ctid=a46229c7-21d1-417d-a1cb-1857a07d2765" frameborder="0" allowFullScreen="true"></iframe>
    </>
  );
};

export default PowerBiComponent;
