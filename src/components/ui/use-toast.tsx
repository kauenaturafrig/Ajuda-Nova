// src/components/ui/use-toast.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = {
    id: number;
    title?: string;
    message: string;
    variant?: "default" | "destructive";
};

type ToastContextValue = {
    showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, ...toast }]);

        // some depois de 3s
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Container dos toasts */}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            rounded px-4 py-2 shadow-lg text-sm text-white
                            ${toast.variant === "destructive" ? "bg-red-600" : "bg-green-600"}
                            transform transition-all
                            animate-toast-in
                        `}
                    >
                        {toast.title && (
                            <div className="font-semibold mb-0.5">{toast.title}</div>
                        )}
                        <div>{toast.message}</div>
                    </div>
                ))}
            </div>

        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return ctx;
}
