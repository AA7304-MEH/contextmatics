import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    // FIX: Initialize state using a class property instead of in the constructor.
    // This is a more modern and concise syntax that resolves the error on line 15.
    state: State = { hasError: false, error: null };

    // FIX: Removed the 'public' keyword. It's the default and can sometimes cause issues with certain TypeScript/linter configurations.
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    // FIX: Removed the 'public' keyword.
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    // FIX: Removed the 'public' keyword. This helps resolve the errors about state and props not existing.
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl border border-red-500/50 max-w-lg w-full">
                        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Something went wrong</h3>
                        <p className="mt-4 text-slate-600 dark:text-slate-300">We've encountered an unexpected error. Please try refreshing the page to resolve the issue.</p>
                        <details className="mt-4 p-2 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-500 dark:text-slate-400">
                            <summary className="cursor-pointer font-semibold">Error Details</summary>
                            <pre className="mt-2 whitespace-pre-wrap font-mono">
                                {this.state.error?.message}
                            </pre>
                        </details>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
