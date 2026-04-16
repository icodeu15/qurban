import Image from "next/image";
import clsx from "clsx";

type BrandLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function BrandLogo({
  className,
  width = 220,
  height = 75,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/brand/niat-berqurban-logo.svg"
      alt="Niat Berqurban"
      width={width}
      height={height}
      priority={priority}
      className={clsx("h-auto w-auto", className)}
    />
  );
}
