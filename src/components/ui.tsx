import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { block?: boolean };

export function Button({ block, className = '', ...rest }: ButtonProps) {
  const classes = ['btn', block ? 'btn--block' : '', className].filter(Boolean).join(' ');
  return <button className={classes} {...rest} />;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function Input({ label, id, ...rest }: InputProps) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className="field" htmlFor={inputId}>
      <span className="field__label">{label}</span>
      <input id={inputId} className="field__input" {...rest} />
    </label>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={['card', className].filter(Boolean).join(' ')}>{children}</div>;
}
