import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

type StudentAvatarProps = {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-lg sm:size-20 sm:text-xl",
};

export function StudentAvatar({ name, photoUrl, size = "sm", className }: StudentAvatarProps) {
  const base = cn("shrink-0 rounded-full", SIZES[size], className);
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- user-supplied URLs, not optimisable
    return <img src={photoUrl} alt="" className={cn(base, "object-cover")} />;
  }
  return (
    <span aria-hidden className={cn(base, "flex items-center justify-center bg-surface font-semibold text-ink-soft ring-1 ring-line")}>
      {initials(name)}
    </span>
  );
}
