"use client";

import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function SignIn() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-primary/20">
      <div className="flex flex-col gap-4  md:p-10">
        <div className="flex flex-1 items-center justify-center relative top-[-100px]">
          <div className="w-full max-w-md relative min-h-[200px]">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/50 z-10" />
        <Image
          src="/img/banners/banner4.jpg"
          alt="Juba Model Primary School"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
