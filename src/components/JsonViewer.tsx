"use client";

import { useState } from "react";

type JsonViewerProps = {
    data: any;
    color: string;
};

export function JsonViewer({ data, color }: JsonViewerProps) {
    const [expanded, setExpanded] = useState(false);
    const jsonString = JSON.stringify(data, null, 2);
    const isLong = jsonString.length > 200;

    return (
        <>
            {/* Visualização miniatura clicável */}
            <div className="relative">
                <pre 
                    onClick={() => setExpanded(true)}
                    className={`bg-${color}-50 dark:bg-${color}-900/30 p-3 rounded-lg text-xs font-mono text-gray-900 dark:text-gray-100 border border-${color}-200 dark:border-${color}-800/50 overflow-auto max-h-20 cursor-pointer hover:opacity-80 transition-opacity whitespace-pre-wrap`}
                >
                    {jsonString.slice(0, 150) + (isLong ? '...' : '')}
                </pre>
                
                {isLong && (
                    <div className="absolute bottom-1 right-1 text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-0.5 bg-white/80 dark:bg-gray-700/80 rounded">
                        👆 Clique para expandir
                    </div>
                )}
            </div>

            {/* Modal sobreposto */}
            {expanded && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
                    onClick={() => setExpanded(false)}
                >
                    <div 
                        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl max-h-[80vh] w-full mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header do modal */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                JSON Detalhado
                            </h3>
                            <button
                                onClick={() => setExpanded(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Conteúdo JSON vertical */}
                        <div className="p-6 overflow-auto max-h-[calc(80vh-80px)]">
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs font-mono text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
                                {jsonString}
                            </pre>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-right">
                            <button
                                onClick={() => setExpanded(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}