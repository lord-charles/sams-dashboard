import {
  Dropdown,
  DropdownTrigger,
} from "@nextui-org/react";
import NextImage from "next/image";
import React, { useState } from "react";
import { AcmeIcon } from "../icons/acme-icon";
import { Logo } from "../../../../public/img/mogei.png";
import { AcmeLogo } from "../icons/acmelogo";
import { BottomIcon } from "../icons/sidebar/bottom-icon";
import Image from "next/image";

export const CompaniesDropdown = () => {
  const [company, setCompany] = useState({
    name: "SAMS",
    location: "South Sudan",
    logo: <AcmeIcon />,
  });
  return (
    <Dropdown
      classNames={{
        base: "w-full flex items-center justify-center",
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2 ml-4">
          <Image
            priority
            width={200}
            height={200}
            src="/img/mogei.png"
            className="object-contain w-[120px] h-[120px]"
            alt="Mogei logo for GESS South Sudan"
          />

        </div>
      </DropdownTrigger>
    </Dropdown>
  );
};
