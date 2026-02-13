"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { getColorHex } from "@/lib/colors";
import { motion } from "framer-motion";

interface SharedSelectorProps {
  selected: string;
  onSelect: (value: string) => void;
  options: string[];
  isAvailable: (value: string) => boolean;
}

interface SizeSelectorProps extends SharedSelectorProps {
  onOpenSizeGuide: () => void;
}

interface ColorSelectorProps extends SharedSelectorProps {
  customColorMap?: Record<string, string>;
}

// Separate Size Selector
export function ProductSizeSelector({
  options,
  selected,
  onSelect,
  isAvailable,
  onOpenSizeGuide,
}: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-xs font-bold text-slate-900">SELECT SIZE</span>
        <button
          onClick={onOpenSizeGuide}
          className="text-[10px] font-semibold text-green-600 hover:text-green-700 transition-colors uppercase tracking-wider"
        >
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {options.map((size) => {
          const available = isAvailable(size);
          const isSelected = selected === size;

          return (
            <button
              key={size}
              onClick={() => onSelect(size)}
              disabled={!available}
              className={cn(
                "h-12 min-w-[3.5rem] px-4 rounded-xl text-sm font-bold transition-all duration-200 border-2 relative active:scale-95",
                isSelected
                  ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50",
                !available &&
                  "opacity-30 cursor-not-allowed bg-slate-50 border-transparent grayscale",
              )}
            >
              {size}
              {!available && (
                <div className="absolute inset-x-2 top-1/2 h-0.5 bg-slate-300 -rotate-12" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Separate Color Selector (Visual Style)
export function ProductColorSelector({
  options,
  selected,
  onSelect,
  isAvailable,
  customColorMap,
}: ColorSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="mb-3">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          COLOR: <span className="text-green-600">{selected || "SELECT"}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-3.5">
        {options.map((color) => {
          const available = isAvailable(color);
          const isSelected = selected === color;
          const hex = getColorHex(color, customColorMap);
          return (
            <div key={color} className="relative group">
              <button
                disabled={!available}
                onClick={() => onSelect(color)}
                className={cn(
                  "h-12 w-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center relative active:scale-90",
                  isSelected
                    ? "border-green-600 p-0.5 scale-110 shadow-md"
                    : "border-slate-100 p-0 hover:border-slate-200",
                  !available && "opacity-30 cursor-not-allowed grayscale",
                )}
                title={color}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundColor: hex,
                    boxShadow:
                      hex.toLowerCase() === "#ffffff"
                        ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                        : "none",
                  }}
                />
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        hex.toLowerCase() === "#ffffff"
                          ? "bg-slate-900"
                          : "bg-white",
                      )}
                    />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Legacy export if needed, or composite for simple usage
interface ProductSelectorsProps {
  sizeOptions: string[];
  colorOptions: string[];
  selectedSize: string;
  selectedColor: string;
  onSelectSize: (size: string) => void;
  onSelectColor: (color: string) => void;
  onOpenSizeGuide: () => void;
  isAvailable: (size: string, color: string) => boolean;
  isSizeAvailable: (size: string) => boolean;
  centered?: boolean;
}

export function ProductSelectors({
  sizeOptions,
  colorOptions,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
  onOpenSizeGuide,
  isAvailable,
  isSizeAvailable,
  centered = false,
}: ProductSelectorsProps) {
  // Composite wrapper if used elsewhere
  return (
    <div className={cn("space-y-8", centered ? "text-center" : "")}>
      <div className={centered ? "flex justify-center" : ""}>
        <ProductColorSelector
          options={colorOptions}
          selected={selectedColor}
          onSelect={onSelectColor}
          isAvailable={(c) => true}
        />
      </div>

      <div className={centered ? "flex justify-center" : ""}>
        <ProductSizeSelector
          options={sizeOptions}
          selected={selectedSize}
          onSelect={onSelectSize}
          onOpenSizeGuide={onOpenSizeGuide}
          isAvailable={isSizeAvailable}
        />
      </div>
    </div>
  );
}
