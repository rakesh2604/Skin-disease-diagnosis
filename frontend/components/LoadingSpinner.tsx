/**
 * Loading Spinner Component
 * Medical-themed loading indicator
 */

'use client';

import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = "Analyzing image..." }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12" role="status" aria-live="polite" aria-busy="true">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-medical-border rounded-full"></div>
                <div className="w-16 h-16 border-4 border-medical-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-medical-text font-medium" aria-label={message}>
                {message}
            </p>
            <p className="text-sm text-gray-600 mt-2">
                Applying Dull-Razor preprocessing...
            </p>
            <span className="sr-only">Loading, please wait</span>
        </div>
    );
}
