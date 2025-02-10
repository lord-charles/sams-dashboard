"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { handleSignIn } from "../api-handlers/authentication";
import { MailIcon } from "../components/ui/icons/mail-icon";
import { LockIcon } from "../components/ui/icons/lock-icon";

const AuthPage = () => {
  const [isLoading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {}, [searchParams]);
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const username = String(formData.get("username"));
    const password = String(formData.get("password"));
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
    try {
      const response = await handleSignIn({ username, password, callbackUrl });

      if (response?.ok) {
        router.refresh();
        setLoading(false);
        toast.success(`Login successful...`);
        setTimeout(async () => {
          router.replace(`${response?.url}`);
          // router.refresh();
        }, 1000);
      } else {
        toast.error(`${response?.error}`);
        setLoading(false);
      }
    } catch (error) {
      // console.error(error);
    }
  };
  return (
    <>
      <section className="bg-gray-200 w-full h-full">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
          >
            <Image
              isBlurred
              className="w-8 h-8 mr-2"
              src="/img/mogei.png"
              alt="logo"
            />
            SAMS
          </a>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Reset password
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                <Input
                  label="Username"
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  placeholder="Enter your email to receive reset password link"
                  type="email"
                  name="username"
                  isRequired
                  variant="bordered"
                />
                <Button
                  isLoading={isLoading}
                  type="submit"
                  color="primary"
                  className="w-full"
                >
                  Get password reset link
                </Button>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthPage;
