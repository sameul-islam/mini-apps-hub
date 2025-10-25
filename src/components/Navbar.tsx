"use client";

import Link from "next/link";
import InstallButton from "./InstallButton";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="w-[98%] bg-white/10 backdrop-blur-md rounded-2xl my-5 font-Noto p-6 lg:w-[85%]  mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
      
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <Link href="/">
        <div className="py-2 px-3 border-2 border-t-[#009689] border-b-[#ffa801] border-l-[#51a2ff] border-r-[#fafafa] border-dotted rounded-2xl bg-white/10 flex items-center justify-center">
          <span className="text-xl text-white font-bold">
            M<span className="text-[#009689] text-2xl">A</span>H
          </span>
        </div>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Mini Apps Hub
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            Simplify your daily tasks and boost productivity
          </p>
        </div>
      </div>

      {/* Right: Social Icons + Install */}
      <div className="flex items-center gap-4 text-white text-lg">
        <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
        <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
        <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
        <a href="#" className="hover:text-blue-700"><FaLinkedinIn /></a>
        <a href="#" className="hover:text-gray-300"><FaGithub /></a>

        <div className="ml-4">
          <InstallButton />
        </div>
      </div>
    </header>
  );
}
