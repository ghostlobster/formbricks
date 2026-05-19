import { AlertCircle } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ElementErrorProps {
  /** Error message to display */
  errorMessage?: string;
  /** Optional id for the live region, enabling aria-describedby association from form inputs */
  id?: string;
  /** Text direction: 'ltr' (left-to-right), 'rtl' (right-to-left), or 'auto' (auto-detect from content) */
  dir?: "ltr" | "rtl" | "auto";
}

function ElementError({ errorMessage, id, dir = "auto" }: Readonly<ElementErrorProps>): React.JSX.Element {
  return (
    <>
      {/* Error indicator bar - decorative, hidden from screen readers */}
      {errorMessage ? (
        <div
          aria-hidden="true"
          className={cn(
            "bg-destructive absolute top-0 bottom-0 w-[4px]",
            dir === "rtl" ? "right-[-10px]" : "left-[-10px]"
          )}
        />
      ) : null}
      {/*
       * Live region always rendered so the browser registers it before content arrives.
       * JAWS (both Browse and Forms mode) requires the region to exist in DOM before
       * content changes to announce the error reliably.
       */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id={id}
        dir={dir}
        className={errorMessage ? "text-destructive mb-2 flex items-center gap-1 text-sm" : "sr-only"}>
        {errorMessage ? (
          <>
            <AlertCircle className="size-4" aria-hidden="true" />
            <span>{errorMessage}</span>
          </>
        ) : null}
      </div>
    </>
  );
}

export { ElementError };
export type { ElementErrorProps };
