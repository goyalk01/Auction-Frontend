import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dim Void Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-void/90 transition-opacity"
      />

      {/* Modal Box */}
      <div
        className={`relative z-10 w-full ${widthMap[maxWidth]} max-h-[90vh] flex flex-col bg-charcoal border border-white/[0.1] rounded-lg shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-deep">
            <div>
              {title && (
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-silver-bright">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-[11px] text-silver mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-silver-dark hover:text-silver-bright hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}
