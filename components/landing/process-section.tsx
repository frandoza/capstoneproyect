import { Beaker, ClipboardCheck, ClipboardList, FlaskConical, SlidersHorizontal } from "lucide-react";

const steps = [
  {
    title: "Brief técnico",
    description: "Recibimos producto, matriz, sabor objetivo, etapa y necesidad de muestra.",
    icon: ClipboardList,
  },
  {
    title: "Revisión de aplicación",
    description: "Validamos base, proceso, restricciones, claim natural y desempeño esperado.",
    icon: Beaker,
  },
  {
    title: "Perfil natural",
    description: "Seleccionamos o ajustamos el perfil según intensidad, notas y compatibilidad.",
    icon: SlidersHorizontal,
  },
  {
    title: "Muestra y ajuste",
    description: "Entregamos una versión validable y abrimos rondas de ajuste sensorial.",
    icon: FlaskConical,
  },
];

export function ProcessSection() {
  return (
    <section id="proceso" className="mx-auto w-full max-w-7xl px-5 py-18 sm:px-8 sm:py-24 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Proceso
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
            Del requerimiento industrial a una muestra lista para validar.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            La web debe ordenar la solicitud antes del primer contacto para que
            el área técnica no empiece desde cero y pueda evaluar viabilidad,
            matriz y perfil desde el inicio.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-lg border border-border/80 bg-white/80 p-6 shadow-[0_16px_50px_rgb(45_71_45/7%)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-12 rounded-lg border border-border/80 bg-white/72 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-semibold text-foreground">
              Resultado esperado del 30% inicial
            </h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Una landing que ya comunique especialización técnica, muestre la
              segmentación correcta y prepare el camino para un brief conectado
              a WhatsApp, correo o CRM en la siguiente etapa.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-md bg-secondary px-4 py-3 text-sm font-medium text-primary">
            <ClipboardCheck className="size-5" aria-hidden="true" />
            Base visual y comercial lista para ampliar
          </div>
        </div>
      </div>
    </section>
  );
}
