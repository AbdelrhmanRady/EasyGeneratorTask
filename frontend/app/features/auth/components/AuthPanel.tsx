type AuthPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthPanel({ eyebrow, title, description }: AuthPanelProps) {
  return (
    <aside className="relative hidden overflow-hidden bg-ink px-12 py-16 text-canvas lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-canvas/10 blur-3xl" />
      <p className="relative text-sm font-medium tracking-[0.2em] uppercase text-canvas/70">
        {eyebrow}
      </p>
      <div className="relative space-y-4">
        <h1 className="max-w-sm font-serif text-5xl leading-tight">{title}</h1>
        <p className="max-w-sm text-base text-canvas/75">{description}</p>
      </div>
      <p className="relative text-sm text-canvas/55">
        Built as a production-ready authentication module.
      </p>
    </aside>
  );
}
