export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-lg text-gray-600">
          If you can see this, the basic Next.js setup is working!
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Environment: {process.env.NODE_ENV}
        </p>
      </div>
    </div>
  );
}
