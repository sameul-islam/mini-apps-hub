"use client";

import { useEffect, useMemo, useState } from "react";
import RecipeCard from "./components/RecipeCard";
import RecipeModal, { Recipe } from "./components/RecipeModal";

const THEMEALDB_SEARCH = (q: string) =>
  `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;

export default function RecipeLabPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search API call with debounce
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setRecipes([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(THEMEALDB_SEARCH(query.trim()), { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch recipes from TheMealDB.");
        const data = await res.json();

        if (!data?.meals) {
          setRecipes([]);
          setLoading(false);
          return;
        }

        const mapped: Recipe[] = data.meals.map((m: any) => {
          const ingredients: string[] = [];
          for (let i = 1; i <= 20; i++) {
            const ing = m[`strIngredient${i}`];
            const measure = m[`strMeasure${i}`];
            if (ing && ing.trim()) {
              ingredients.push(measure ? `${measure.trim()} ${ing.trim()}` : ing.trim());
            }
          }

          return {
            id: String(m.idMeal),
            name: m.strMeal,
            categories: m.strCategory ? [m.strCategory] : [],
            ingredients,
            instructions: m.strInstructions || "",
            image: m.strMealThumb || "",
            videoUrl: m.strYoutube || undefined,
            createdAt: Date.now(),
          } as Recipe;
        });

        setRecipes(mapped);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const filtered = useMemo(() => recipes, [recipes]);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-black text-green-200 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-green-400">RecipeLab</h1>
            <p className="text-green-200/70 mt-1">
              Search global recipes — with images, ingredients, and YouTube videos.
            </p>
          </div>

          {/* Search Input */}
          <div className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search recipes e.g. chicken, pasta..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-[360px] px-3 py-2 rounded bg-neutral-900 text-green-100 border border-green-700 placeholder-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
            <button
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-black font-semibold"
              onClick={() => {
                setQuery("");
                setRecipes([]);
              }}
            >
              Clear
            </button>
          </div>
        </header>

        {/* Loading & Error */}
        {loading && <div className="text-green-300 mb-4">Loading recipes...</div>}
        {error && <div className="text-red-400 mb-4">Error: {error}</div>}

        {/* Recipes Grid */}
        {filtered.length === 0 && !loading ? (
          <div className="py-20 text-center text-green-200/60">
            No recipes found. Try another search (minimum 2 characters).
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onOpen={(rec) => {
                  setSelected(rec);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
