import Link from "next/link";
import { SketchNotebook } from "@/components/ui-custom/sketch-elements";
import { HandwrittenText } from "@/components/ui-custom/handwritten-text";

/**
 * 404 — Page not found.
 *
 * Notebook aesthetic: warm paper background, serif display type,
 * hand-drawn SketchNotebook illustration, and a handwritten tagline.
 * Renders full-bleed (no AppShell chrome) so the page feels like a
 * torn sheet slipped between the others.
 */
export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 bg-[oklch(0.96_0.02_78)] dark:bg-[oklch(0.18_0.012_75)]">
      <div className="max-w-md flex flex-col items-center gap-6">
        <SketchNotebook size={120} className="float-subtle-slow" />

        <div className="space-y-2">
          <h1 className="font-serif-display text-6xl sm:text-7xl text-foreground leading-none">
            404
          </h1>
          <p className="font-serif-display text-xl sm:text-2xl text-foreground/80 italic">
            Page not found
          </p>
        </div>

        <HandwrittenText as="p" color="coral" className="text-2xl sm:text-3xl">
          The page you&apos;re looking for seems to have been torn out.
        </HandwrittenText>

        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-soft"
        >
          Back to KTU One
        </Link>
      </div>
    </main>
  );
}
