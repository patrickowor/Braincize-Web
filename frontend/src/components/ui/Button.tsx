import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      {...props}
      className={cn(
        "flex items-center justify-center bg-brand text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    />
  );
}
