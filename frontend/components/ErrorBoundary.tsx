/**
 * Error Boundary Component
 * Catches and handles React component errors gracefully
 */

'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="bg-white border border-red-200 rounded-lg p-8 max-w-md shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-red-600">
                                Something went wrong
                            </h2>
                        </div>
                        <p className="text-gray-700 mb-4">
                            The application encountered an unexpected error. This has been logged for investigation.
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            Error: {this.state.error?.message || 'Unknown error'}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
