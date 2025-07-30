'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [testMode, setTestMode] = useState(false)
  
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Check if this is test mode
    const isTestMode = searchParams.get('test_mode') === 'true'
    setTestMode(isTestMode)
    
    // Get session_id from URL
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      // In a real app, you'd verify the payment here
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAF8FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
            Processing your cosmic blueprint...
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#FAF8FC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Something went wrong
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
            Please contact support if you were charged.
          </p>
          <a href="/" className="mt-4 inline-block text-purple-600 hover:underline" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
            Return to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8FC] py-16">
      <div className="max-w-2xl mx-auto px-8">
        {/* Logo and Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-7xl font-light tracking-wider text-black mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            ASTROLOGIE
          </h1>
          <div className="w-24 h-0.5 bg-purple-600 mx-auto mb-12"></div>
          <h2 
            className="text-3xl font-light mb-4 text-black"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {testMode ? 'Test Mode - Payment Skipped' : 'Payment Successful'}
          </h2>
          <p 
            className="text-lg text-gray-600"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            Your personalized cosmic blueprint is being prepared
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 mb-12">
          <div className="text-center">
            <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 
              className="text-2xl mb-4 text-black"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {testMode ? 'Test Order Confirmed!' : 'Thank you for your purchase!'}
            </h3>
            <p 
              className="text-gray-600 mb-8 leading-relaxed"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              Our AI astrologers are analyzing your unique celestial configuration. 
              Your comprehensive birth chart report will be ready in approximately 2-3 minutes.
            </p>
            {testMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <p 
                  className="text-yellow-800"
                  style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}
                >
                  🧪 This is a test order. No payment was processed.
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-8 mt-8">
            <h4 
              className="text-sm tracking-widest uppercase mb-6 text-black"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              WHAT'S INCLUDED IN YOUR REPORT
            </h4>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-lg">✓</span>
                <span style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
                  Complete natal chart analysis with planetary positions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-lg">✓</span>
                <span style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
                  Personality insights based on your sun, moon, and rising signs
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-lg">✓</span>
                <span style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
                  Life path guidance and career recommendations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-lg">✓</span>
                <span style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
                  Relationship compatibility analysis
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-lg">✓</span>
                <span style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
                  Future trends and upcoming cosmic influences
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-12">
          <p 
            className="text-gray-600 mb-2"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            You will receive your report via email within 5 minutes.
          </p>
          <p 
            className="text-sm text-gray-500"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            If you don't receive it, please check your spam folder or contact support.
          </p>
        </div>

        {/* Coming Soon: Report Preview */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-12">
          <h3 
            className="text-2xl mb-6 text-center text-black"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Report Preview
          </h3>
          <div className="text-center text-gray-500">
            <p 
              className="mb-4 text-lg"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              🔮 AI Report Generation Coming Soon!
            </p>
            <p 
              className="text-sm"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              In the next phase, we'll integrate Claude AI to generate your personalized astrological report.
            </p>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="/" 
            className="text-purple-600 hover:underline"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}
          >
            Generate another report
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p 
            className="text-sm text-purple-600" 
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            © 2024 Astrologie. Celestial Insights for the Elite.
          </p>
        </div>
      </div>
    </div>
  )
}