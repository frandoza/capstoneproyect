import { Beer, Candy, Citrus, Coffee, Droplets, IceCreamBowl, Milk, Snowflake, Wheat } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  {
    title: "Bebidas",
    description: "Perfiles naturales para refrescos, bebidas funcionales y bases acuosas.",
    icon: Citrus,
    accent: "bg-[color:var(--fruit-citrus)]",
    detail: "Matriz acuosa",
  },
  {
    title: "Yogurt y lácteos",
    description: "Frutales, cremosos y indulgentes con foco en acidez y balance.",
    icon: Milk,
    accent: "bg-[#76a985]",
    detail: "Matriz láctea",
  },
  {
    title: "Licores",
    description: "Manzana, limón, sandía, piña y perfiles compatibles con alcohol.",
    icon: Beer,
    accent: "bg-[color:var(--fruit-berry)]",
    detail: "Matriz alcohólica",
  },
  {
    title: "Helados",
    description: "Café, fresa, vainilla y notas cremosas para sistemas congelados.",
    icon: IceCreamBowl,
    accent: "bg-[color:var(--fruit-mango)]",
    detail: "Matriz grasa/congelada",
  },
  {
    title: "Panificación",
    description: "Vainilla, chocolate, frutos rojos y perfiles que soportan horneo.",
    icon: Wheat,
    accent: "bg-[#8a6a48]",
    detail: "Matriz horneada",
  },
  {
    title: "Postres y confitería",
    description: "Gelatina, flan, budín, dulces y aplicaciones de alta recordación.",
    icon: Candy,
    accent: "bg-primary",
    detail: "Matriz gelificada",
  },
];

const matrixItems = [
  { title: "Acuosa", icon: Droplets, examples: "Refrescos, funcionales, gaseosas" },
  { title: "Láctea", icon: Milk, examples: "Yogurt, bebidas lácteas, postres" },
  { title: "Alcohólica", icon: Beer, examples: "Licores, RTD, macerados" },
  { title: "Congelada", icon: Snowflake, examples: "Helados, paletas, cremas" },
  { title: "Horneada", icon: Wheat, examples: "Kekes, galletas, panificación" },
  { title: "Tostada", icon: Coffee, examples: "Café, cacao, caramelo" },
];

export function CategoriesSection() {
  return (
    <section id="aplicaciones" className="relative border-y border-border/70 bg-white/62 py-18 sm:py-22">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Aplicaciones
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
            Segmentación pensada para industrias e ingenieros alimentarios.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            La página guía la conversación por aplicación y matriz, porque un
            mismo sabor natural cambia según base, proceso y objetivo sensorial.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.title}
              className="rounded-lg border-border/80 bg-card/90 py-0 shadow-[0_16px_50px_rgb(45_71_45/8%)] transition-transform duration-300 hover:-translate-y-1"
            >
              <CardHeader className="gap-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-primary">
                    <category.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className={`h-2.5 w-12 rounded-full ${category.accent}`} />
                </div>
                <div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="mt-2 text-base leading-7">
                    {category.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="font-medium text-primary">{category.detail}</span>
                  <span className={`h-2 w-8 rounded-full ${category.accent}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div id="matrices" className="mt-14 rounded-lg border border-primary/14 bg-[linear-gradient(135deg,#fffdf7,#edf4e9)] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                Matrices
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
                El punto de partida técnico no es solo el sabor, es donde va a funcionar.
              </h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Esta capa ayuda a que un cliente técnico identifique rápido si
                el desarrollo debe evaluarse en base acuosa, láctea, alcohólica,
                grasa, congelada u horneada.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {matrixItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-md border border-primary/10 bg-white/72 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                      <item.icon className="size-4" aria-hidden="true" />
                    </span>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.examples}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
