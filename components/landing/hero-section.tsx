import { ArrowRight, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";

import { CanModelViewer } from "@/components/landing/can-model-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const proofPoints = [
  "Perfiles por matriz alimentaria",
  "Sabores naturales para validación técnica",
  "Brief, muestra y ajuste por aplicación",
];

const briefItems = [
  ["Aplicación", "Bebida, lácteo, licor, helado"],
  ["Matriz", "Acuosa, láctea, alcohólica, grasa"],
  ["Perfil", "Natural, fresco, cremoso, intenso"],
];

export function HeroSection() {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-24">
      <div className="max-w-3xl">
        <Badge
          variant="outline"
          className="border-primary/20 bg-white/60 px-3 py-1 text-primary"
        >
          Desarrollo B2B para industria alimentaria
        </Badge>
        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.04] tracking-normal text-foreground sm:text-5xl lg:text-6xl">
          Sabores naturales desarrollados para aplicaciones alimentarias.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Diseñamos perfiles de sabor según producto, matriz y etapa de
          desarrollo para que equipos de I+D, compras y marca puedan evaluar
          muestras con criterios claros.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 bg-primary px-6 text-base text-primary-foreground hover:bg-primary/92"
          >
            <a href="#contacto">
              Solicitar evaluación técnica
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-primary/20 bg-white/70 px-6 text-base text-primary hover:bg-secondary"
          >
            <a href="#aplicaciones">Ver aplicaciones</a>
          </Button>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          {proofPoints.map((point) => (
            <div key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-5 top-8 h-28 w-28 rounded-full bg-[color:var(--fruit-citrus)]/18 blur-3xl" />
        <div className="absolute -right-2 bottom-6 h-32 w-32 rounded-full bg-[color:var(--fruit-berry)]/12 blur-3xl" />
        <div className="relative overflow-hidden rounded-lg border border-primary/12 bg-white/74 p-3 shadow-[0_28px_90px_rgb(45_71_45/14%)]">
          <div className="relative aspect-[0.82] min-h-[430px] overflow-hidden rounded-md bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#eef4e9_38%,#dfe9d7_100%)]">
            <CanModelViewer />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-md border border-white/60 bg-white/78 px-4 py-3 text-sm shadow-sm backdrop-blur">
              <span className="font-medium text-primary">Visual de aplicación</span>
              <span className="text-muted-foreground">Bebidas</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/70 bg-white/86 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ClipboardList className="size-4 text-primary" aria-hidden="true" />
                Pre-brief técnico inicial
              </div>
              <div className="mt-4 grid gap-2">
                {briefItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 rounded-md bg-white/72 px-3 py-2 text-xs"
                  >
                    <span className="font-semibold uppercase tracking-[0.12em] text-primary/70">
                      {label}
                    </span>
                    <span className="text-right text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  El objetivo es que cada contacto llegue con producto, matriz
                  y perfil esperado antes de pasar al equipo técnico.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
