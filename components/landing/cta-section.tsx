import { ArrowRight, Mail, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

const fields = [
  "Empresa",
  "Producto a desarrollar",
  "Matriz alimentaria",
  "Sabor objetivo",
  "Etapa del proyecto",
  "Necesidad de muestra",
];

export function CtaSection() {
  return (
    <section id="contacto" className="relative overflow-hidden px-5 py-18 sm:px-8 sm:py-24 lg:px-10">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/55" />
      <div className="relative mx-auto max-w-7xl rounded-lg border border-primary/14 bg-[linear-gradient(135deg,#fffdf7,#edf4e9)] p-6 shadow-[0_24px_90px_rgb(45_71_45/11%)] sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Brief técnico
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
              La siguiente etapa será convertir esta landing en captación técnica.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Por ahora queda planteada la estructura visual. Luego este bloque
              puede conectarse a WhatsApp Business, correo, CRM o una base de
              datos para recibir solicitudes completas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-primary px-5 text-base text-primary-foreground hover:bg-primary/92"
              >
                <a href="mailto:desarrollo@foodsolutions.com">
                  Enviar brief por correo
                  <Mail className="size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-primary/20 bg-white/70 px-5 text-base text-primary hover:bg-secondary"
              >
                <a href="#aplicaciones">
                  Revisar aplicaciones
                  <MessageCircle className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-primary/12 bg-white/76 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="font-semibold text-foreground">Pre-brief del cliente</h3>
                <p className="mt-1 text-sm text-muted-foreground">Estructura prevista para una fase posterior.</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Send className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field}
                  className="rounded-md border border-border bg-background/70 px-4 py-3"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/70">
                    {field}
                  </span>
                  <div className="mt-2 h-2 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 border-t border-primary/12 pt-6 text-sm text-muted-foreground sm:grid-cols-3">
          <span className="flex items-center gap-2">
            <ArrowRight className="size-4 text-primary" aria-hidden="true" />
            Brief técnico o comercial
          </span>
          <span className="flex items-center gap-2">
            <ArrowRight className="size-4 text-primary" aria-hidden="true" />
            Ajuste por aplicación
          </span>
          <span className="flex items-center gap-2">
            <ArrowRight className="size-4 text-primary" aria-hidden="true" />
            Muestra para validación
          </span>
        </div>
      </div>
    </section>
  );
}
