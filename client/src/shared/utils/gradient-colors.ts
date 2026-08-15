// Curated list of Tailwind linear gradient classes 

export const GRADIENT_COLORS = [
  "bg-linear-to-tr from-yellow-400 to-amber-500",
  "bg-linear-to-tr from-amber-500 to-orange-600",
  "bg-linear-to-tr from-orange-400 to-red-500",
  "bg-linear-to-tr from-rose-400 to-red-600",
  "bg-linear-to-tr from-pink-500 to-rose-500",
  "bg-linear-to-tr from-purple-500 to-pink-500",
  "bg-linear-to-tr from-violet-500 to-purple-600",
  "bg-linear-to-tr from-indigo-500 to-purple-600",
  "bg-linear-to-tr from-blue-500 to-indigo-600",
  "bg-linear-to-tr from-sky-400 to-blue-600",
  "bg-linear-to-tr from-cyan-400 to-blue-500",
  "bg-linear-to-tr from-teal-400 to-emerald-600",
  "bg-linear-to-tr from-emerald-400 to-teal-600",
  "bg-linear-to-tr from-green-400 to-emerald-600",
  "bg-linear-to-tr from-lime-400 to-green-600",
  "bg-linear-to-tr from-fuchsia-500 to-rose-500",
  "bg-linear-to-tr from-violet-600 to-indigo-600",
  "bg-linear-to-tr from-red-500 to-rose-700",
  "bg-linear-to-tr from-yellow-500 to-orange-500",
  "bg-linear-to-tr from-emerald-500 to-cyan-600",
] as const;

export type GradientColor = (typeof GRADIENT_COLORS)[number];


// Returns a completely random gradient class from the collection.

export const getRandomGradient = (): GradientColor => {
  const randomIndex = Math.floor(Math.random() * GRADIENT_COLORS.length);
  return GRADIENT_COLORS[randomIndex];
};

/**
 * Returns a consistent (deterministic) gradient class based on a string/number key.
 * Useful for assigning stable gradient colors to items like IDs, names, or titles across re-renders.
 */
export const getDeterministicGradient = (
  seed: string | number = ""
): GradientColor => {
  const str = String(seed);
  if (!str) return GRADIENT_COLORS[0];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index];
};
