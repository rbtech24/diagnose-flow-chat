
import { AlertTriangle } from "lucide-react";

type LoadingOverlayProps = {
  isError?: boolean;
  errorMessage?: string;
};

export function LoadingOverlay({ isError = false, errorMessage = "An error occurred. Please try again." }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/50 z-50 flex flex-col items-center justify-center">
      {isError ? (
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">{errorMessage}</p>
        </div>
      ) : (
        <>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </>
      )}
    </div>
  );
}
