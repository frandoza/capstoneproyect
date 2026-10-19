import { z } from "zod";

export const categories = ["Bebidas", "Lácteos", "Helados", "Panificación"] as const;
export function applicationLabel(category: string) {
  if (category === "Lácteos") return "Lácteos: leches y yogures";
  if (category === "Helados") return "Helados y postres congelados";
  return category;
}
export const stages = ["Idea inicial", "Formulación", "Pruebas piloto", "Producto en producción"] as const;
export const statuses = ["Nueva", "En revisión", "Contactada"] as const;
const short = (max: number) => z.string().trim().min(1, "Complete este campo.").max(max);
export const briefSchema = z.object({
  application: z.enum(categories),
  flavor: short(160),
  stage: z.enum(stages),
  company: short(160),
  name: short(120),
  email: z.string().trim().email("Ingrese un correo válido.").max(254),
  product: short(300),
  process: z.string().trim().max(1000),
  ph: z.string().trim().refine(v => v === "" || (/^\d{1,2}([.,]\d{1,2})?$/.test(v) && Number(v.replace(",", ".")) <= 14), "El pH debe estar entre 0 y 14."),
  restrictions: z.string().trim().max(1000),
  consent: z.literal(true, { errorMap: () => ({ message: "Debe autorizar el registro de la solicitud." }) }),
});
export type Brief = z.infer<typeof briefSchema>;
export type RequestRecord = { id: string; payload: string; status: typeof statuses[number]; created_at: string; updated_at: string };
export const stageGuidance: Record<typeof stages[number], string> = {
  "Idea inicial": "El siguiente paso es definir la matriz y una referencia sensorial del producto.",
  "Formulación": "Conviene compartir la composición general de la base y las restricciones del desarrollo.",
  "Pruebas piloto": "Conviene registrar las condiciones de proceso y los criterios de evaluación de la muestra.",
  "Producto en producción": "Conviene indicar el perfil actual y el cambio sensorial que se busca evaluar.",
};
export const orientation: Record<typeof categories[number], string> = {
  Bebidas: "Conviene revisar el pH, la solubilidad, la carbonatación y el tratamiento térmico de la bebida.",
  Lácteos: "Conviene revisar el contenido de grasa y proteína, la fermentación y las condiciones de conservación.",
  Helados: "Conviene revisar la base acuosa o grasa, el dulzor y la temperatura de consumo.",
  Panificación: "Conviene revisar el tiempo y la temperatura de horneado, la humedad y el momento de incorporación.",
};
