export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  defaultValue,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/80">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}
