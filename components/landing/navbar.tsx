import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Aplicaciones", href: "#aplicaciones" },
  { label: "Matrices", href: "#matrices" },
  { label: "Proceso", href: "#proceso" },
  { label: "Capacidades", href: "#empresa" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#" className="flex items-center" aria-label="Food Solutions">
          <span className="flex h-12 w-44 items-center overflow-hidden rounded-md border border-primary/10 bg-white px-2 shadow-sm sm:w-52">
            <img
              src="/assets/food-solutions-logo.png"
              alt="Food Solutions"
              className="h-full w-full object-contain"
            />
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <Button
          asChild
          className="bg-primary px-4 text-primary-foreground hover:bg-primary/92"
        >
          <a href="#contacto">
            Enviar brief
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </Button>
      </nav>
    </header>
  );
}
