"use client";

import React, { FC, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export interface Recipe {
  id: string;
  name: string;
  categories?: string[];
  ingredients: string[];
  instructions: string;
  image?: string;
  videoUrl?: string; // may be empty
}

interface Props {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

const RecipeModal: FC<Props> = ({ recipe, open, onClose }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open || !recipe) return null;

  // Prepare embed: if recipe.videoUrl exists and looks like youtube or embed, use it.
  // else fall back to a YouTube search embed (playlist search)
  const getEmbedSrc = () => {
    const v = String(recipe.videoUrl || "").trim();
    if (!v) {
      // YouTube search embed (works as a search playlist embed)
      const q = encodeURIComponent(recipe.name);
      return `https://www.youtube.com/embed?listType=search&list=${q}`;
    }
    // If full url, try to convert watch?v= to embed
    if (v.includes("youtube.com/watch")) {
      return v.replace("watch?v=", "embed/");
    }
    if (v.includes("youtube.com/embed")) return v;
    if (v.includes("youtu.be/")) {
      const id = v.split("youtu.be/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    // fallback: embed the videoUrl (may or may not work)
    return v;
  };

  const embedSrc = getEmbedSrc();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-4xl bg-neutral-900 text-green-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-green-900"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-green-100">{recipe.name}</h2>
            {Array.isArray(recipe.categories) && recipe.categories.length > 0 && (
              <div className="text-sm text-green-300 mt-1">
                {recipe.categories.join(" • ")}
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-green-900/20">
            <FaTimes className="text-green-200" />
          </button>
        </div>

        {recipe.image && (
          <img src={recipe.image} alt={recipe.name} className="w-full h-60 object-cover rounded-md mb-4 border border-green-900" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h4 className="font-semibold text-green-100 mb-2">Instructions</h4>
            <div className="prose prose-invert max-w-none text-green-200" dangerouslySetInnerHTML={{ __html: recipe.instructions.replace(/\n/g, "<br/>") }} />
          </div>

          <aside className="bg-neutral-800 p-3 rounded-md border border-green-900">
            <h4 className="font-semibold text-green-100 mb-2">Ingredients</h4>
            <ul className="list-disc list-inside text-green-200 space-y-1">
              {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-green-100 mb-2">Video / Tutorials</h4>
          <div className="w-full aspect-video rounded-md overflow-hidden border border-green-900">
            <iframe
              src={embedSrc}
              title={recipe.name}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          {!recipe.videoUrl && (
            <p className="text-sm text-green-300 mt-2">
              No specific video found — showing YouTube search results for this recipe.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecipeModal;
