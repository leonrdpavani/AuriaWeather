"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { GlassCard } from "@/ui";
import { listCities } from "@/lib/api/weather";
import { cn } from "@/lib/utils/cn";

interface CitySearchProps {
  onSelect: (city: string) => void;
  className?: string;
}

/** Busca de cidade com sugestões (filtra o mock). Acessível e animada. */
export function CitySearch({ onSelect, className }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const cities = useMemo(() => listCities(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    );
  }, [cities, query]);

  function choose(city: string) {
    onSelect(city);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5">
        <Search className="size-4 shrink-0 text-ink-subtle" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Search for a city or airport"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle outline-none"
          aria-label="Search for a city"
        />
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-20 mt-2 w-full"
          >
            <GlassCard className="overflow-hidden p-1.5">
              {results.map((c) => (
                <button
                  key={c.city}
                  onMouseDown={() => choose(c.city)}
                  className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-glass-strong"
                >
                  <MapPin className="size-4 text-ink-subtle" />
                  <span className="text-sm font-medium text-ink">{c.city}</span>
                  <span className="text-xs text-ink-subtle">{c.country}</span>
                </button>
              ))}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
