'use client';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm text-muted">{label}</label>}
      <input
        id={id}
        className={cn(
          'glass px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-teal/50 transition-colors',
          className
        )}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm text-muted">{label}</label>}
      <textarea
        id={id}
        className={cn(
          'glass px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-teal/50 transition-colors resize-none',
          className
        )}
        {...props}
      />
    </div>
  );
}
