export function IconButton({ icon: Icon, label, className = "", ...props }) {
  return (
    <button title={label} aria-label={label} className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-ink hover:bg-paper ${className}`} {...props}>
      <Icon size={18} />
    </button>
  );
}

