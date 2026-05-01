import type { LucideIcon } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function LoginInputField({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  id,
  autoComplete,
}: {
  label: string;
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  id: string;
  autoComplete?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="ml-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400"
      >
        {label}
      </label>
      <div className="group relative">
        <div className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#3ABFB4]">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <input
          id={id}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-[1.8rem] border border-slate-100 bg-white py-4 pr-12 pl-14 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all hover:border-slate-200 focus:border-[#3ABFB4]/20 focus:ring-8 focus:ring-[#3ABFB4]/5"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-5 -translate-y-1/2 text-slate-300 transition-colors hover:text-slate-500"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
