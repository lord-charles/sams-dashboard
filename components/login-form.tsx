"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const schema = z.object({
  username: z.string().nonempty({ message: "Username is required" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
});

type FormData = z.infer<typeof schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setError("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="bg-primary/30 p-6 space-y-2 relative top-2">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            priority
            width={200}
            height={200}
            src="/img/mogei.png"
            className="object-contain w-[120px] h-[120px]"
            alt="Mogei logo for GESS South Sudan"
          />
          <h1 className="text-3xl font-bold tracking-tight">Welcome to SAMS</h1>
          <p className="text-balance text-sm text-muted-foreground">
            School Attendance Monitoring System
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="h-11"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {String(errors.username.message)}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              className="h-11"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {String(errors.password.message)}
              </p>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            Sign in
          </Button>
        </div>
      </Card>
    </form>
  );
}
