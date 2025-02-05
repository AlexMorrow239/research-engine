import { Component, type ErrorInfo, type ReactNode } from "react";

import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

import "./ErrorBoundary.scss";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // You could add error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error?: Error;
  errorInfo?: ErrorInfo;
}

type ErrorType = "404" | "401" | "403" | "500" | "network" | "unknown";

const getErrorType = (error: unknown): ErrorType => {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return "404";
    if (error.status === 401) return "401";
    if (error.status === 403) return "403";
    if (error.status === 500) return "500";
  }

  if (error instanceof Error) {
    if (error.name === "NetworkError" || error.message.includes("network")) {
      return "network";
    }
  }

  return "unknown";
};

const ERROR_MESSAGES = {
  "404": {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or has been moved.",
    icon: "🔍",
  },
  "401": {
    title: "Unauthorized",
    message: "Please log in to access this resource.",
    icon: "🔒",
  },
  "403": {
    title: "Access Denied",
    message: "You don't have permission to access this resource.",
    icon: "🚫",
  },
  "500": {
    title: "Server Error",
    message: "Our servers are having trouble. Please try again later.",
    icon: "🔧",
  },
  network: {
    title: "Network Error",
    message: "Please check your internet connection and try again.",
    icon: "📡",
  },
  unknown: {
    title: "Oops! Something went wrong",
    message: "An unexpected error occurred.",
    icon: "⚠️",
  },
} as const;

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorInfo,
}) => {
  const navigate = useNavigate();
  const routeError = useRouteError();
  const displayError = error || routeError;

  const errorType = getErrorType(displayError);
  const { title, message, icon } = ERROR_MESSAGES[errorType];

  const handleRetry = (): void => {
    window.location.reload();
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  const handleGoHome = (): void => {
    navigate("/");
  };

  const isDebugMode = import.meta.env.VITE_ENABLE_DEBUG === true;
  const timestamp = new Date().toLocaleString();

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-icon">{icon}</div>
        <h1>{title}</h1>
        <p className="error-message">
          {(displayError instanceof Error ? displayError.message : null) ||
            message}
        </p>{" "}
        <div className="error-actions">
          <button
            onClick={handleRetry}
            className="button button--primary"
            aria-label="Retry"
          >
            Try Again
          </button>
          <button
            onClick={handleGoBack}
            className="button button--secondary"
            aria-label="Go back"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="button button--secondary"
            aria-label="Go to homepage"
          >
            Go Home
          </button>
        </div>
        {isDebugMode && (displayError || errorInfo) && (
          <div className="error-details">
            <div className="error-metadata">
              <p>
                <strong>Timestamp:</strong> {timestamp}
              </p>
              <p>
                <strong>Error Type:</strong> {errorType}
              </p>
              <p>
                <strong>Error Name:</strong>{" "}
                {displayError instanceof Error ? displayError.name : "Unknown"}
              </p>
            </div>
            {displayError instanceof Error && displayError.stack && (
              <div className="error-section">
                <h3>Stack Trace:</h3>
                <pre className="error-stack">{displayError.stack}</pre>
              </div>
            )}
            {errorInfo?.componentStack && (
              <div className="error-section">
                <h3>Component Stack:</h3>
                <pre className="error-stack">{errorInfo.componentStack}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
