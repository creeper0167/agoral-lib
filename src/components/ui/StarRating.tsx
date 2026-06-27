"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 18,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
            aria-label={`${star} ستاره`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-border"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
