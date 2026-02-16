// components/ErrorBoundary.tsx
import { useRouteError } from "react-router-dom";

interface RouteError {
  message?: string;
  statusText?: string;
  error?: {
    message?: string;
  };
}

export default function ErrorBoundary() {
  const error = useRouteError() as RouteError;

  // Helper function to safely get error message
  const getErrorMessage = (err: unknown): string => {
    if (!err) return "";

    if (typeof err === "string") {
      return err;
    }

    if (err instanceof Error) {
      return err.message;
    }

    if (typeof err === "object" && "message" in err) {
      return (err as { message?: string }).message || "";
    }

    if (typeof err === "object" && "statusText" in err) {
      return (err as { statusText?: string }).statusText || "An error occurred";
    }

    return "An unexpected error occurred";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Icône d'erreur animée */}
          <div
            className="mx-auto flex items-center justify-center h-24 w-24 
                        rounded-full bg-red-100 mb-6"
          >
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oups ! Une erreur est survenue
          </h2>

          <p className="text-gray-600 mb-6">{getErrorMessage(error)}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg 
                       hover:bg-gray-300 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
