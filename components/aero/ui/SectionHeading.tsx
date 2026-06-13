"use client";
import Reveal from "@/components/aero/ui/Reveal";
import Eyebrow from "@/components/aero/ui/Eyebrow";

interface Props {
  eyebrow?: string;
  heading: React.ReactNode;
  sub?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  heading,
  sub,
  align = "left",
  className = "",
}: Props) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <Eyebrow label={eyebrow} align={align} className="mb-6" />
      )}
      <h2
        className="font-display font-medium leading-[1.06] tracking-[-0.015em] text-[var(--aero-text)]"
        style={{ fontSize: "clamp(34px, 5.4vw, 66px)" }}
      >
        {heading}
      </h2>
      {sub && (
        <p
          className={`mt-6 font-body font-light text-[16px] leading-[1.8] text-[var(--aero-muted)] max-w-[560px] ${
            centered ? "mx-auto" : ""
          }`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
