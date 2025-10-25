
"use client";

import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";


const apps = [
  "ToDo List", "Notes", "Economic Calculator", "Budget Planner", "RecipeLab",
  "Grocery List", "Chemistry Calculator", "Dictionary", "Expense Tracker",
  "Scientific Calculator", "Bill Splitter", "Tip Calculator", "Unit Converter",
  "BMI Calculator", "Water Tracker", "Meal / Calorie Logger", "Password Generator",
  "QR Code Generator", "QR Scanner", "Color Picker / Palette", "Image Compressor",
  "Calendar", "Markdown Previewer", "JSON Formatter", "IP & Geolocation",
  "Weather", "Language Translator", "Random Quote", "Daily Affirmation",
  "Clipboard / Notes Share"
];

export default function HomePage() {
  const [search, setSearch] = useState("");


  const filteredApps = apps.filter(app =>
    app.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen font-Noto flex flex-col items-center p-4 sm:p-6">
      

      {/* Hero Section with Search */}
      <section className="md:w-[90%] w-full max-w-7xl mb-8 bg-white/10 backdrop-blur-md rounded-xl p-6 text-center shadow-lg flex flex-col gap-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Everything You Need for Daily Productivity
        </h2>
        <p className="text-gray-300 text-sm sm:text-base md:text-lg">
          Explore our mini apps designed to organize your work, track habits, manage finances, and simplify daily routines. Each app is intuitive, fast, and ready to use. Whether you are a student, professional, or homemaker, find tools to make your day smoother and more efficient.
        </p>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apps..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </section>

      {/* App Grid */}
      <section className="flex-1 w-[90%] max-w-7xl overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
          {filteredApps.map((name, index) => (
            <Link
              key={index}
              href={`/apps/${name.toLowerCase().replace(/ /g, "-")}`}
              className="group block rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/15 p-4 text-center transition transform hover:-translate-y-1 shadow-md"
            >
              <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-lg bg-[#0b4f4a] backdrop-blur-sm mb-3 group-hover:bg-[#00786f] transition-all duration-200">
                <span className="text-lg text-white font-medium">
                  {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
              </div>
              <div className="text-white font-semibold text-sm sm:text-base">{name}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
