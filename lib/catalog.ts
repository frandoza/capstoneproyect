import { z } from "zod";
import { categories } from "./brief";

export type Category = typeof categories[number];
export type CatalogEntry = { names: string[]; revision: string | null };
export type Catalog = Record<Category, CatalogEntry>;
export const defaultFlavors: Record<Category, readonly string[]> = {
  Bebidas: ["Limón", "Naranja", "Mandarina", "Maracuyá", "Mango", "Piña", "Manzana", "Durazno", "Fresa", "Frutos rojos", "Uva", "Menta"],
  Lácteos: ["Fresa", "Vainilla", "Cacao", "Durazno", "Mango", "Coco", "Café", "Caramelo", "Dulce de leche", "Arándano", "Frutos rojos", "Maracuyá"],
  Helados: ["Vainilla", "Cacao", "Fresa", "Limón", "Mango", "Maracuyá", "Coco", "Café", "Dulce de leche", "Pistacho", "Avellana", "Menta"],
  Panificación: ["Vainilla", "Cacao", "Naranja", "Limón", "Canela", "Almendra", "Avellana", "Mantequilla", "Caramelo", "Coco", "Café", "Dulce de leche"],
};
export function initialCatalog(): Catalog {
  return Object.fromEntries(categories.map(c => [c, { names: [...defaultFlavors[c]], revision: null }])) as Catalog;
}
export const catalogSchema = z.object({
  category: z.enum(categories),
  names: z.array(z.string().trim().min(1).max(60).refine(v => !/[\u0000-\u001f\u007f]/.test(v), "Nombre no válido.")).min(1).max(30)
    .refine(names => new Set(names.map(n => n.normalize("NFC").toLocaleLowerCase("es"))).size === names.length, "Hay sabores repetidos."),
  revision: z.string().uuid().nullable(),
});
