export function AmbientFlavorBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[-12%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-[color:var(--fruit-citrus)]/16 blur-3xl" />
      <div className="absolute right-[-14%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="ambient-drift absolute bottom-[-18%] left-[28%] h-[32rem] w-[32rem] rounded-full bg-[color:var(--fruit-berry)]/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(38_74_53/0.08)_1px,transparent_0)] [background-size:28px_28px]" />
    </div>
  );
}
