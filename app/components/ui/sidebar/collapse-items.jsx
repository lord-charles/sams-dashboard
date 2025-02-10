import React, { useState } from "react";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import Link from "next/link";

export const CollapseItems = ({ icon, items, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0">
        <AccordionItem
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5",

            title:
              "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span className="text-sm ml-1">{title}</span>
            </div>
          }
        >
          <div className="pl-12 space-y-2 ">
            {items.map((item, index) => (
              <Button key={index} className="w-full flex text-default-500 hover:text-primary transition-colors">
                <Link
                  href={item?.url}
                  className="w-full flex  text-default-500 hover:text-primary transition-colors"
                >
                  {item?.name}
                </Link>
              </Button>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
