export const lenses = ["backend", "dados"] as const;

export type Lens = (typeof lenses)[number];

export const defaultLens: Lens = "backend";

/** Query-string key, e.g. `/?lente=dados`. */
export const lensParam = "lente";

export const lensContent = {
  switchLabel: "Lente do portfólio",
  options: [
    { value: "backend", label: "Back-end" },
    { value: "dados", label: "IA & Dados" },
  ],
} as const satisfies {
  switchLabel: string;
  options: readonly { value: Lens; label: string }[];
};

/** Copy that changes with the lens. */
export type ByLens<T> = Record<Lens, T>;
