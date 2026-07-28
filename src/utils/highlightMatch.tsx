import React from "react";

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim() || !text) return text;

  const trimmedQuery = query.trim();
  const regex = new RegExp(`(${trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-400/30 text-amber-200 font-bold px-0.5 rounded border border-amber-400/40"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
