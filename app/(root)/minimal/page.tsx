export default function MinimalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Minimal Page</h1>
        <p className="text-lg text-gray-600">
          This is a minimal page without any database calls or authentication.
        </p>
      </div>
    </div>
  );
}
