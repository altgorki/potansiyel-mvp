import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover, ...props }: CardProps) {
  return (
    <div className={cn('glass p-6', hover && 'glass-hover transition-all cursor-pointer', className)} {...props}>
      {children}
    </div>
  );
}
