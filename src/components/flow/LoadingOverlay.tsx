
export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
