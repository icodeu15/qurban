import Image from "next/image";
import clsx from "clsx";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      className={clsx("inline-flex h-[75px] w-auto shrink-0 items-center", className)}
      aria-label="Niat Berqurban"
    >
      <Image
        src="/brand/niat-berqurban-logo-compact.png.tmp.png"
        alt=""
        aria-hidden="true"
        width={553}
        height={211}
        priority={priority}
        className="h-full w-auto sm:hidden"
      />
      <Image
        src="/brand/niat-berqurban-logo-wide.png.tmp.png"
        alt=""
        aria-hidden="true"
        width={515}
        height={180}
        priority={priority}
        className="hidden h-full w-auto sm:block"
      />
    </span>
  );
}
