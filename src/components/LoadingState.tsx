export default function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="text-center space-y-4">
        <div className="h-8 w-48 bg-gray-800 rounded-lg mx-auto" />
        <div className="h-16 w-32 bg-gray-800 rounded-lg mx-auto" />
        <div className="h-4 w-24 bg-gray-800 rounded mx-auto" />
      </div>

      <div className="h-4 w-full bg-gray-800 rounded-full" />

      <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
        <div className="h-6 w-36 bg-gray-700 rounded" />
        <div className="h-20 w-full bg-gray-700 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-xl p-4 space-y-2"
          >
            <div className="h-3 w-16 bg-gray-700 rounded" />
            <div className="h-8 w-24 bg-gray-700 rounded" />
            <div className="h-3 w-20 bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-4 w-24 bg-gray-800 rounded" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-32 bg-gray-800 rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 w-32 bg-gray-800 rounded-xl" />
        ))}
      </div>

      <div className="text-center text-gray-500 text-sm">
        Analyzing wallet transactions...
      </div>
    </div>
  );
}
