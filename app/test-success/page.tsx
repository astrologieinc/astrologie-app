'use client'

export default function TestSuccessPage() {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Success!</h1>
          <p className="text-xl text-gray-700 mb-8">
            Your Astrologie birth chart has been generated!
          </p>
          <div className="bg-purple-50 rounded-lg p-6 mb-8">
            <p className="text-purple-900 font-semibold mb-2">Test Mode Active</p>
            <p className="text-gray-600">
              In production, your personalized astrology report would appear here.
            </p>
          </div>
          <a 
            href="/"
            className="inline-block bg-purple-900 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}
