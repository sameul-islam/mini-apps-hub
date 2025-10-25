"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import InstallButton from "./InstallButton";

export default function Footer() {
  return (
    <footer className="w-[95%] lg:w-[85%] mx-auto mb-6 mt-14 bg-white/10 backdrop-blur-md rounded-3xl p-8 text-gray-300 flex flex-col md:flex-row justify-between gap-8 shadow-lg font-Noto">
      
      {/* Left Column: Logo + Description */}
      <div className="flex flex-col gap-4 md:w-1/4">
        <div className="flex items-center gap-3">
          <Link href="/">
          <div className="py-2 px-3 border-2 border-t-[#009689] border-b-[#ffa801] border-l-[#51a2ff] border-r-[#fafafa] border-dotted rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="text-xl text-white font-bold">M<span className="text-[#009689] text-2xl">A</span>H</span>
          </div>
          </Link>
          <h2 className="text-lg font-extrabold text-white">Mini Apps Hub</h2>
        </div>
        <p className="text-sm text-gray-400">
          Simplify your daily tasks and boost productivity. Access all your favorite mini apps in one place, anytime, anywhere.
        </p>
        <div className="mt-2">
          <InstallButton />
        </div>
      </div>

      {/* Middle Column: Useful Links */}
      <div className="flex flex-col gap-4 md:w-1/4">
        <h3 className="text-white font-semibold text-lg">Quick Links</h3>
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
        <Link href="/faq" className="hover:underline">FAQ</Link>
        <Link href="/tutorials" className="hover:underline">Tutorials</Link>
      </div>

      {/* Right Column: Social & Features */}
      <div className="flex flex-col gap-4 md:w-1/4">
        <h3 className="text-white font-semibold text-lg">Connect with us</h3>
        <div className="flex items-center gap-4 text-white text-lg">
          <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
          <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
          <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
          <a href="#" className="hover:text-blue-700"><FaLinkedinIn /></a>
          <a href="#" className="hover:text-gray-300"><FaGithub /></a>
        </div>

        <h3 className="text-white font-semibold text-lg mt-4">Features</h3>
        <ul className="text-gray-400 text-sm list-disc list-inside">
          <li>30+ Mini Apps</li>
          <li>Offline Support</li>
          <li>PWA Installable</li>
          <li>Cloud Sync (Future)</li>
          <li>AI Integration (Future)</li>
        </ul>
      </div>
    </footer>
  );
}
