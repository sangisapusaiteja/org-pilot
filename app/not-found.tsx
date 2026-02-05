export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 rounded-xl border border-border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex mb-4 gap-2">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <span className="text-sm font-bold">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            The page you are looking for does not exist.
          </p>
        </div>
      </div>
    </div>
  );
}
