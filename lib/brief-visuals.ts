import { Apple, Bean, Cherry, Citrus, Coffee, Flower2, FlaskConical, Leaf, Nut } from "lucide-react";
import type { categories } from "@/lib/brief";

export const applicationVisuals: Record<typeof categories[number], { image: string; alt: string }> = {
  Bebidas: { image: "/assets/brief/beverage.png", alt: "Botella de vidrio, referencia de bebidas" },
  Lácteos: { image: "/assets/brief/dairy.png", alt: "Yogur en un recipiente blanco, referencia de lácteos" },
  Helados: { image: "/assets/brief/ice-cream.png", alt: "Helado en un cuenco blanco, referencia de productos congelados" },
  Panificación: { image: "/assets/brief/bakery.png", alt: "Brioche y rebanada, referencia de panificación" },
};

export const flavorVisuals = [
  { name: "Limón", icon: Citrus, accent: "#9c7817", wash: "#f6f4df" },
  { name: "Fresa", icon: Cherry, accent: "#af4459", wash: "#f9edef" },
  { name: "Vainilla", icon: Flower2, accent: "#817337", wash: "#f6f3e5" },
  { name: "Cacao", icon: Bean, accent: "#795344", wash: "#f1eae5" },
  { name: "Naranja", icon: Citrus, accent: "#b76320", wash: "#fff1e3" },
  { name: "Mandarina", icon: Citrus, accent: "#b86c28", wash: "#fff3e5" },
  { name: "Maracuyá", icon: Flower2, accent: "#94721e", wash: "#faf4db" },
  { name: "Mango", icon: Apple, accent: "#a77520", wash: "#fff2d8" },
  { name: "Piña", icon: Leaf, accent: "#7b812d", wash: "#f5f5df" },
  { name: "Manzana", icon: Apple, accent: "#54813c", wash: "#edf5e7" },
  { name: "Durazno", icon: Apple, accent: "#b0674e", wash: "#fceee6" },
  { name: "Frutos rojos", icon: Cherry, accent: "#97405e", wash: "#f8eaf0" },
  { name: "Uva", icon: Cherry, accent: "#785781", wash: "#f2edf6" },
  { name: "Coco", icon: Nut, accent: "#737363", wash: "#f1f2ec" },
  { name: "Café", icon: Coffee, accent: "#77564a", wash: "#f2ece7" },
  { name: "Caramelo", icon: Bean, accent: "#a27334", wash: "#faf0df" },
  { name: "Dulce de leche", icon: Bean, accent: "#976b3f", wash: "#f7eee2" },
  { name: "Arándano", icon: Cherry, accent: "#5d658e", wash: "#eef0f8" },
  { name: "Pistacho", icon: Nut, accent: "#6f803d", wash: "#eff4e4" },
  { name: "Avellana", icon: Nut, accent: "#8d6546", wash: "#f5ece3" },
  { name: "Menta", icon: Leaf, accent: "#398269", wash: "#e7f5ed" },
  { name: "Canela", icon: Leaf, accent: "#995b41", wash: "#f7ece5" },
  { name: "Almendra", icon: Nut, accent: "#8a754e", wash: "#f5f0e5" },
  { name: "Mantequilla", icon: Bean, accent: "#908031", wash: "#f8f5dc" },
] as const;

type FlavorName = typeof flavorVisuals[number]["name"];
export const applicationFlavors: Record<typeof categories[number], readonly FlavorName[]> = {
  Bebidas: ["Limón", "Naranja", "Mandarina", "Maracuyá", "Mango", "Piña", "Manzana", "Durazno", "Fresa", "Frutos rojos", "Uva", "Menta"],
  Lácteos: ["Fresa", "Vainilla", "Cacao", "Durazno", "Mango", "Coco", "Café", "Caramelo", "Dulce de leche", "Arándano", "Frutos rojos", "Maracuyá"],
  Helados: ["Vainilla", "Cacao", "Fresa", "Limón", "Mango", "Maracuyá", "Coco", "Café", "Dulce de leche", "Pistacho", "Avellana", "Menta"],
  Panificación: ["Vainilla", "Cacao", "Naranja", "Limón", "Canela", "Almendra", "Avellana", "Mantequilla", "Caramelo", "Coco", "Café", "Dulce de leche"],
};

export function getApplicationFlavors(application: string) {
  const names = applicationFlavors[application as keyof typeof applicationFlavors];
  return names ? names.map(name => flavorVisuals.find(item => item.name === name)!) : flavorVisuals;
}
export function getFlavorVisual(flavor: string) {
  // Only explicit presets receive a flavor illustration; custom briefs stay neutral.
  return flavorVisuals.find(v => v.name.toLocaleLowerCase("es") === flavor.trim().toLocaleLowerCase("es"))
    ?? { name: flavor.trim() || "Perfil por definir", icon: FlaskConical, accent: "#39795c", wash: "#edf3ef" };
}
