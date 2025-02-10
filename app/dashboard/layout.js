import React from "react";
import LayoutProvider from "../layout-providers/LayoutProvider";

const RootLayout = ({ children }) => {
  return <LayoutProvider>{children}</LayoutProvider>;
};

export default RootLayout;
