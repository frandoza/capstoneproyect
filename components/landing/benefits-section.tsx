import { Factory, FileCheck2, Leaf, LockKeyhole, TimerReset, UsersRound } from "lucide-react";

const benefits = [
  {
    title: "Especialización por aplicación",
    description: "Cada perfil se evalúa según producto, matriz, proceso y objetivo sensorial.",
    icon: Factory,
  },
  {
    title: "Soporte técnico-comercial",
    description: "Acompañamiento para brief, selección de perfil, muestra y ajuste.",
    icon: FileCheck2,
  },
  {
    title: "Sabores naturales",
    description: "Enfoque en perfiles naturales como diferencial para la industria alimentaria.",
    icon: Leaf,
  },
  {
    title: "Confidencialidad",
    description: "La confianza se comunica por sectores atendidos, no por clientes expuestos.",
    icon: LockKeyhole,
  },
  {
    title: "Velocidad de evaluación",
    description: "Solicitudes mejor ordenadas reducen vueltas y aceleran la etapa de muestra.",
    icon: TimerReset,
  },
  {
    title: "Lenguaje B2B",
    description: "Contenido preparado para industrias, ingenieros, I+D, compras y marca.",
    icon: UsersRound,
  },
];

export function BenefitsSection() {
  return (
    <section id="empresa" className="bg-primary py-18 text-primary-foreground sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
            Empresa
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            Una pagina que demuestra capacidad tecnica antes de la llamada.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/76">
            Para este tipo de cliente, la web no necesita explicar lo básico:
            necesita probar foco industrial, experiencia por aplicación y una
            forma clara de iniciar el desarrollo.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-lg border border-white/14 bg-white/[0.07] p-6"
            >
              <benefit.icon className="size-6 text-[color:var(--fruit-citrus)]" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold">{benefit.title}</h3>
              <p className="mt-3 text-base leading-7 text-white/72">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
