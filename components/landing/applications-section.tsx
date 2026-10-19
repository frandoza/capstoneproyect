"use client";

import { useRef } from "react";
import { applicationLabel } from "@/lib/brief";
import { ArrowRight, Beaker, IceCreamBowl, Milk, Wheat, Wine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const applications = [
  {
    title: "Bebidas", accent: "citrus", icon: Wine,
    text: "Desarrollo de perfiles para bases acuosas, carbonatadas y funcionales.",
    products: "Bebidas saborizadas, refrescos, bebidas carbonatadas y bases para bebidas.",
    flavors: "Cítricos, frutas tropicales, frutos rojos y notas herbales.",
    criteria: ["pH y composición de la base", "Carbonatación y tratamiento térmico", "Sistema de endulzado y perfil sensorial objetivo"],
  },
  {
    title: "Lácteos", accent: "leaf", icon: Milk,
    text: "Perfiles sensoriales para yogures, bebidas lácteas y postres.",
    products: "Yogures, leches saborizadas, bebidas lácteas y postres refrigerados.",
    flavors: "Vainilla, fresa, chocolate, caramelo y perfiles frutales.",
    criteria: ["Contenido de grasa y proteína", "Fermentación y tratamiento térmico", "Acidez y condiciones de conservación"],
  },
  {
    title: "Helados", accent: "berry", icon: IceCreamBowl,
    text: "Perfiles para productos congelados con base láctea, de agua o vegetal.",
    products: "Helados de leche o crema, sorbetes, paletas y postres congelados de base vegetal.",
    flavors: "Vainilla, chocolate, frutas, frutos secos y notas de postres.",
    criteria: ["Base acuosa o grasa", "Temperatura de consumo y proceso de congelación", "Dulzor, textura y presencia sensorial deseada"],
  },
  {
    title: "Panificación", accent: "amber", icon: Wheat,
    text: "Desarrollo de sabores considerando horneado, matriz y vida útil objetivo.",
    products: "Galletas, bizcochos, masas dulces y rellenos.",
    flavors: "Mantequilla, vainilla, cítricos, cacao y especias.",
    criteria: ["Temperatura y tiempo de horneado", "Humedad, grasa y composición de la masa", "Incorporación antes o después del horneado"],
  },
];

export function ApplicationsSection({ onSelect }: { onSelect: (category: string) => void }) {
  const pendingSelection = useRef<string | null>(null);
  return (
    <section id="aplicaciones" className="scroll-mt-24 bg-[#f6f2e8] py-22 sm:py-28" aria-labelledby="applications-title">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div data-reveal className="grid gap-7 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <p className="section-kicker">Aplicaciones</p>
          <h2 id="applications-title" className="section-title">Un mismo sabor no se comporta igual en todas las matrices.</h2>
        </div>
        <div data-line className="mt-10 h-px bg-[#173c2d]/20" />
        <p className="mt-6 text-sm leading-6 text-[#173c2d]/80">Organizamos las soluciones por aplicación. Los helados, incluidos los elaborados con leche, se agrupan en productos congelados.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {applications.map((item, index) => (
            <article data-reveal key={item.title} className={`application-item flex flex-col accent-${item.accent}`}>
              <div className="flex items-start justify-between">
                <span className="text-sm text-[#173c2d]/60">0{index + 1}</span>
                <item.icon className="size-6" aria-hidden="true" />
              </div>
              <div className="mt-12 flex-1 lg:mt-20">
                <h3 className="text-2xl font-semibold">{applicationLabel(item.title)}</h3>
                <p className="mt-3 leading-7 text-[#173c2d]/80">{item.text}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-7 h-auto min-h-11 w-full justify-between gap-2 whitespace-normal bg-transparent py-3 text-left" aria-label={`Ver aplicación: ${item.title}`}>
                    Ver aplicación <ArrowRight aria-hidden="true" />
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} onCloseAutoFocus={(event) => {
                  if (pendingSelection.current !== item.title) return;
                  event.preventDefault();
                  pendingSelection.current = null;
                  onSelect(item.title);
                }} className="max-h-[85dvh] overflow-y-auto bg-white text-[#173c2d] sm:max-w-2xl">
                  <DialogClose className="absolute right-4 top-4 rounded p-2 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2" aria-label="Cerrar ficha" title="Cerrar ficha">
                    <X className="size-5" />
                  </DialogClose>
                  <DialogHeader className="pr-10 text-left">
                    <p className="text-sm font-medium text-muted-foreground">Aplicaciones alimentarias</p>
                    <DialogTitle className="text-3xl leading-tight">{applicationLabel(item.title)}</DialogTitle>
                    <DialogDescription className="text-base leading-7">{item.text}</DialogDescription>
                  </DialogHeader>
                  <dl className="grid gap-5 border-y py-5 sm:grid-cols-2">
                    <div><dt className="font-semibold">Productos de referencia</dt><dd className="mt-2 leading-7 text-muted-foreground">{item.products}</dd></div>
                    <div><dt className="font-semibold">Perfiles a explorar</dt><dd className="mt-2 leading-7 text-muted-foreground">{item.flavors}</dd></div>
                  </dl>
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold"><Beaker className="size-5" aria-hidden="true" /> Variables del desarrollo</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{item.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">Referencias orientativas. La viabilidad, dosificación y desempeño se definen mediante evaluación técnica y pruebas en su matriz.</p>
                  <DialogClose asChild>
                    <Button className="h-auto min-h-12 whitespace-normal py-3" onClick={() => { pendingSelection.current = item.title; }}>Consultar esta aplicación <ArrowRight aria-hidden="true" /></Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
