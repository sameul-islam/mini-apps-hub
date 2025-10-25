// "use client";

// import { useState, useEffect } from "react";

// interface BeforeInstallPromptEvent extends Event {
//   prompt: () => void;
//   userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
// }

// function InstallButton() {
//   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const handler = (e: Event) => {
//       e.preventDefault();
//       setDeferredPrompt(e as BeforeInstallPromptEvent);
//       setShowButton(true);
//     };
//     window.addEventListener("beforeinstallprompt", handler);

//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;

//     deferredPrompt.prompt();

//     const choiceResult = await deferredPrompt.userChoice;
//     if (choiceResult.outcome === "accepted") console.log("App installed!");
//     setDeferredPrompt(null);
//     setShowButton(false);
//   };

//   if (!showButton) return null;

//   return (
//     <button
//       onClick={handleInstall}
//       className="px-4 py-2 bg-[#009689] font-semibold text-white font-Noto rounded-lg hover:bg-[#007a6a]"
//     >
//       Install
//     </button>
//   );
// }

// export default InstallButton;










"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    // Detect platform
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsFirefox(userAgent.includes("firefox"));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") console.log("✅ App installed!");
    setDeferredPrompt(null);
    setShowButton(false);
  };

  // iOS: show custom guide
  if (isIOS) {
    return (
      <div className="text-sm text-center mt-4 bg-yellow-100 p-3 rounded-lg text-gray-800">
        <strong>iPhone/iPad:</strong> Tap <span className="text-blue-600">Share</span> → 
        <span className="text-blue-600"> Add to Home Screen</span> to install this app.
      </div>
    );
  }

  // Firefox: fallback
  if (isFirefox) {
    return (
      <div className="text-sm text-center mt-4 bg-orange-100 p-3 rounded-lg text-gray-800">
        <strong>Firefox:</strong> Use the browser menu → “Install” or “Add to Home Screen”.
      </div>
    );
  }

  if (!showButton) return null;

  // Default (Chrome/Edge/Brave)
  return (
    <button
      onClick={handleInstall}
      className="px-4 py-2 bg-[#009689] font-semibold text-white rounded-lg hover:bg-[#007a6a] transition"
    >
      Install App
    </button>
  );
}

export default InstallButton;
