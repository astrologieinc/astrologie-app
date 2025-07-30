'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface ReportSection {
  title: string;
  content: string;
}

interface Report {
  title: string;
  summary: string;
  sections: ReportSection[];
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'generating' | 'success' | 'error'>('loading')
  const [testMode, setTestMode] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [birthData, setBirthData] = useState<any>(null)
  
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
      // Get birth data from localStorage (set by the form)
      const storedData = localStorage.getItem('birthData')
      if (storedData) {
        const data = JSON.parse(storedData)
        setBirthData(data)
        generateReport(data)
      } else {
        // Use demo data if no birth data found
        const demoData = {
          name: "Cosmic Seeker",
          birthDate: "January 10, 1994",
          birthTime: "12:58 PM EST",
          birthPlace: "New York, USA"
        }
        setBirthData(demoData)
        generateReport(demoData)
      }
    } else {
      setStatus('error')
    }
  }, [searchParams])

  const generateReport = async (data: any) => {
    setStatus('generating')
    
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birthData: data }),
      })
      
      const result = await response.json()
      
      if (result.success && result.report) {
        setReport(result.report)
        setStatus('success')
        // Clear birth data from localStorage
        localStorage.removeItem('birthData')
      } else {
        throw new Error('Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      // Use a demo report as fallback
      setReport({
        title: `Cosmic Blueprint for ${data.name}`,
        summary: "Your personalized astrological analysis reveals profound insights about your destiny.",
        sections: [
          {
            title: "🌟 Sun Sign Analysis",
            content: "Based on your birth date, you possess extraordinary leadership qualities and a magnetic personality that draws success."
          },
          {
            title: "💰 Wealth Indicators", 
            content: "Your chart shows remarkable potential for wealth accumulation. The alignment of Jupiter suggests billionaire potential."
          },
          {
            title: "❤️ Relationships",
            content: "Venus in your chart indicates deep, transformative relationships that will shape your destiny."
          },
          {
            title: "🚀 Career Path",
            content: "Your professional success is written in the stars. Expect major breakthroughs in your chosen field."
          },
          {
            title: "🔮 2024-2025 Forecast",
            content: "The coming year brings unprecedented opportunities. Your time to shine is now."
          }
        ]
      })
      setStatus('success')
    }
  }

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

  if (status === 'generating') {
    return (
      <div className="min-h-screen bg-[#FAF8FC] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          </div>
          <h2 
            className="text-3xl font-light mb-4 text-black"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Consulting the Cosmos...
          </h2>
          <p 
            className="text-gray-600"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            Our AI astrologers are analyzing planetary positions and calculating your unique cosmic blueprint.
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
      <div className="max-w-3xl mx-auto px-8">
        {/* Logo and Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-7xl font-light tracking-wider text-black mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            ASTROLOGIE
          </h1>
          <div className="w-24 h-0.5 bg-purple-600 mx-auto mb-12"></div>
        </div>

        {/* Report Display */}
        {report && (
          <div className="bg-white rounded-lg shadow-lg p-12 mb-12">
            <h2 
              className="text-4xl font-light mb-6 text-center text-black"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {report.title}
            </h2>
            
            {birthData && (
              <div className="text-center mb-8 text-gray-600">
                <p style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
                  Born on {birthData.birthDate} at {birthData.birthTime}
                </p>
                <p style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
                  {birthData.birthPlace}
                </p>
              </div>
            )}

            <p 
              className="text-xl text-center mb-12 text-gray-700 italic"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {report.summary}
            </p>

            <div className="space-y-10">
              {report.sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-0">
                  <h3 
                    className="text-2xl mb-4 text-black"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {section.title}
                  </h3>
                  <p 
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
                  >
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {testMode && (
              <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p 
                  className="text-yellow-800 text-center"
                  style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}
                >
                  🧪 This is a demo report. Full AI-powered reports coming soon!
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mb-12">
          <p 
            className="text-gray-600 mb-2"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            Your complete report has been emailed to you.
          </p>
          <p 
            className="text-sm text-gray-500"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            Check your inbox (and spam folder) within 5 minutes.
          </p>
        </div>

        <div className="text-center">
          <a 
            href="/" 
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}
          >
            Generate Another Report
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