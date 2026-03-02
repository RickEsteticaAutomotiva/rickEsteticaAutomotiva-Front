export function LoadingState({ message = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin" />
      </div>
      <p className="text-gray-500 text-base">{message}</p>
    </div>
  );
}