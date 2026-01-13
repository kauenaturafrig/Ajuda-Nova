// src/components/ui/loading-overlay.tsx
"use client";

type LoadingOverlayProps = {
  show: boolean;
  text?: string;
};

export function LoadingOverlay({ show, text = "Carregando..." }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex flex-col items-center gap-3 text-white">
        {/* bolinha girando */}
        <div className="h-10 w-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-sm font-medium tracking-wide">{text}</span>
      </div>
    </div>
  );
}
