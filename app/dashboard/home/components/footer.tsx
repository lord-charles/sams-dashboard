"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-foreground text-primary">
      <Separator className="my-4" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              South Sudan School Management System
            </h2>
            <p className="text-sm text-black">
              Empowering education through innovative management and data-driven
              insights for South Sudan&apos;s schools.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-black font-semibold">
              <li>
                <Link href="#" className="text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="#" className="text-sm hover:underline">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2 font-semibold text-black">
              <li className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">Juba, South Sudan</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span className="text-sm">+211 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span className="text-sm">info@sssams.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4 text-black ">
              Stay updated with our latest news and updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background text-foreground"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-black">
            © {currentYear} South Sudan School Management System. All rights
            reserved.
          </div>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-sm text-black hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-black hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-black hover:text-primary transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
