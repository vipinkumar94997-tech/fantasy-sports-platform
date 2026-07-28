import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    // Rendering errors are handled by the fallback without leaking details.
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-dark-400 flex items-center justify-center px-4">
          <div className="card max-w-md w-full p-8 text-center">
            <h1 className="text-white text-xl font-bold mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Please reload the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl"
            >
              Reload
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
