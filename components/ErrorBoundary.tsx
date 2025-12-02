import React, { Component, ErrorInfo, ReactNode } from 'react';
import Mascot from './Mascot';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4">
              <Mascot emotion="sad" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hoppsan, något gick snett!</h1>
            <p className="text-gray-600 mb-6">Vår maskot tappade tråden. Försök ladda om sidan.</p>
            <button onClick={this.handleReset} className="bg-ocean text-white px-6 py-2 rounded-xl font-bold">
              Starta om
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;