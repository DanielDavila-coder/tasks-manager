function PageGlow({
  className = "bg-[radial-gradient(circle_at_14%_18%,rgba(147,51,234,0.12),transparent_25%),radial-gradient(circle_at_86%_14%,rgba(147,51,234,0.08),transparent_28%)]",
}) {
  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 ${className}`} />
  );
}

export default PageGlow;
