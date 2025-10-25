"use client";

import React, { FC } from "react";
import type { Recipe } from "./RecipeModal";

interface Props {
  recipe: Recipe;
  onOpen: (r: Recipe) => void;
}

const RecipeCard: FC<Props> = ({ recipe, onOpen }) => {
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  return (
    <article
      onClick={() => onOpen(recipe)}
      className="cursor-pointer bg-neutral-900 hover:bg-neutral-800 rounded-xl p-4 flex flex-col h-full border border-green-900"
      role="button"
    >
      <div className="mb-3">
        {recipe.image ? (
          <div className="w-full h-36 rounded-md overflow-hidden mb-3 bg-black">
            {/* img may be empty string — browser ignores */}
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-36 rounded-md mb-3 bg-neutral-800 flex items-center justify-center text-green-600">
            No image
          </div>
        )}

        <h3 className="text-green-200 font-semibold text-lg line-clamp-2">{recipe.name}</h3>

        {Array.isArray(recipe.categories) && recipe.categories.length > 0 && (
          <div className="mt-2 text-xs text-green-300/80">
            {recipe.categories.slice(0, 3).map((c, idx) => (
              <span key={idx} className="inline-block mr-2 px-2 py-0.5 bg-green-900/30 rounded">{c}</span>
            ))}
          </div>
        )}

        <p className="text-green-200/70 text-sm mt-3 line-clamp-3">
          {ingredients.slice(0, 6).join(", ")}{ingredients.length > 6 ? "…" : ""}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-green-400">
        <span>{recipe.ingredients?.length ? `${recipe.ingredients.length} ingredients` : "Ingredients unknown"}</span>
        <span>{recipe.videoUrl ? "Video available" : "No video"}</span>
      </div>
    </article>
  );
};

export default RecipeCard;
