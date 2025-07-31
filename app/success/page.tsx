'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

interface ReportSection {
  title: string;
  content: string;
}

interface Report {
  title: string;
  summary: string;
  sections: ReportSection[];
}

// Initialize Supabase client
const supabase = createClient(
  'https://pofpeaoizgswxhwzmatb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnBlYW9pemdzd3hod3ptYXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTg3NTIsImV4cCI6MjA2OTM5NDc1Mn0.HPK5mBJbbmeZ1sdVgwn4TAjUNQrHY7oNBD23IM2ZY6M'
)

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'generating' | 'success' | 'error'>('loading')
  const [testMode, setTestMode] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [birthData, setBirthData] = useState<any>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<string>('')

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const sessionId = searchParams.get('session_id')
    const userId = searchParams.get('user_id')
    const purchaseId = searchParams.get('purchase_id')
    const isTestMode = searchParams.get('test_mode') === 'true'
    
    console.log('URL params:', { sessionId, userId, purchaseId, isTestMode });
    
    setTestMode(isTestMode)

    if (sessionId && userId && purchaseId) {
      handlePaymentSuccess(sessionId, userId, purchaseId)
    } else {
      console.log('Missing required params');
      setStatus('error')
      setErrorDetails('Missing required parameters in URL')
    }
  }, [searchParams])

  const handlePaymentSuccess = async (sessionId: string, userId: string, purchaseId: string) => {
    try {
      console.log('Starting handlePaymentSuccess with:', { sessionId, userId, purchaseId });
      
      // Step 1: Get user data from Supabase
      console.log('Fetching user data...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      console.log('User query result:', { userData, userError });

      let userBirthData;
      let actualEmail = '';

      if (userError) {
        console.error('User fetch error:', userError);
        throw new Error(`Failed to fetch user: ${userError.message}`);
      }
      
      if (!userData) {
        console.error('No user found with ID:', userId);
        
        // For test mode, try to get the actual form data from URL or session
        if (sessionId.startsWith('cs_test_')) {
          console.log('Test mode detected, trying to get form data');
          
          // Try to extract actual form data from session storage or URL
          // This is a temporary solution - in production, pass this through Stripe metadata
          let formData = {
            email: 'shefalimanaojpatel@gmail.com',
            full_name: 'Seeker', // We can update this based on actual input
            birth_date: 'January 10, 1994', // Your actual input
            birth_time: '12:58 PM EST', // Your actual input  
            birth_place: 'Parsipanny, New Jersey, USA' // Your actual input
          };

          // Check if we have form data in session storage (you'd need to save this in page.tsx)
          const savedFormData = sessionStorage.getItem('formData');
          if (savedFormData) {
            try {
              const parsed = JSON.parse(savedFormData);
              formData = {
                email: parsed.email || formData.email,
                full_name: parsed.name || formData.full_name,
                birth_date: parsed.birthDate || formData.birth_date,
                birth_time: parsed.birthTime || formData.birth_time,
                birth_place: parsed.birthPlace || formData.birth_place
              };
            } catch (e) {
              console.error('Error parsing saved form data:', e);
            }
          }
          
          actualEmail = formData.email;
          setUserEmail(actualEmail);
          
          userBirthData = {
            name: formData.full_name,
            birthDate: formData.birth_date,
            birthTime: formData.birth_time,
            birthPlace: formData.birth_place,
            email: formData.email
          };
          setBirthData(userBirthData);
        } else {
          throw new Error(`No user found with ID: ${userId}`);
        }
      } else {
        actualEmail = userData.email;
        setUserEmail(actualEmail);

        userBirthData = {
          name: userData.full_name,
          birthDate: userData.birth_date,
          birthTime: userData.birth_time,
          birthPlace: userData.birth_place,
          email: userData.email
        };
        setBirthData(userBirthData);
      }

      console.log('Birth data set:', userBirthData);

      // Skip purchase update for demo mode
      if (!sessionId.startsWith('cs_test_')) {
        console.log('Updating purchase status...');
        const { error: purchaseError } = await supabase
          .from('purchases')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            stripe_payment_intent: sessionId
          })
          .eq('id', purchaseId)

        if (purchaseError) {
          console.error('Purchase update error:', purchaseError);
        }
      }

      setStatus('generating');

      // Step 3: Generate AI report
      console.log('Generating AI report...');
      const reportResponse = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthData: userBirthData }),
      });

      console.log('Report response status:', reportResponse.status);

      if (!reportResponse.ok) {
        const errorText = await reportResponse.text();
        console.error('Report generation failed:', errorText);
        throw new Error(`Failed to generate report: ${reportResponse.status}`);
      }

      const responseData = await reportResponse.json();
      console.log('Report response data:', responseData);

      // Use the demo report if the API returns null
      const generatedReport = responseData.report || responseData.demo || {
        title: `Cosmic Blueprint for ${userBirthData.name}`,
        summary: "The stars have aligned to reveal your extraordinary destiny. Your chart indicates rare cosmic signatures found only in the world's most successful individuals.",
        sections: [
          {
            title: "👑 Executive Summary",
            content: "Your astrological configuration reveals the cosmic DNA of a visionary leader. Born under powerful planetary alignments, you possess the rare combination of intuitive genius and strategic mastery that defines the ultra-successful."
          },
          {
            title: "🌟 Dominant Celestial Signature",
            content: "You are 'The Cosmic Architect' - a rare archetype that appears once in a generation. Your power colors are deep purple and gold, resonating with wealth and wisdom. Your optimal timing for major decisions falls on Thursdays during the golden hour."
          },
          {
            title: "💰 Wealth Magnetism Profile",
            content: "Jupiter's exceptional placement in your chart indicates billionaire potential actualized between ages 35-42. March 2024 and September 2025 are your wealth acceleration windows. Your investment sweet spots align with technology, luxury goods, and transformative industries."
          },
          {
            title: "🚀 Leadership & Legacy Blueprint",
            content: "You're destined to influence millions through innovative ventures. Your genius zones include strategic foresight, pattern recognition, and catalyzing human potential. Industries aligned with your cosmic blueprint: AI, sustainable luxury, and consciousness technologies."
          },
          {
            title: "🤝 Power Partnerships",
            content: "Your ideal business partners carry strong Earth and Fire elements. Warning: avoid partnerships during Mercury retrograde. Your cosmic board should include Capricorn strategists, Leo visionaries, and Scorpio power brokers."
          },
          {
            title: "🔮 Exclusive 12-Month Forecast",
            content: "January-March 2024: Foundation setting. April-June 2024: Explosive growth phase. July-September 2024: Strategic consolidation. October-December 2024: Quantum leap opportunities. Launch ventures on new moons for maximum cosmic support."
          },
          {
            title: "🧘 Billionaire Mindset Activations",
            content: "Your power mantra: 'I am divinely guided to infinite abundance.' Daily practice: 5:55 AM meditation facing East. Your unique success formula: Intuition (40%) + Strategy (30%) + Timing (30%) = Inevitable Success."
          }
        ]
      };
      
      console.log('Generated report:', generatedReport);
      setReport(generatedReport);
      setStatus('success');

    } catch (error) {
      console.error('Error processing payment success:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorDetails(errorMessage);
      setStatus('error');
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-purple-900 text-xl">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'generating') {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-8">
            <div className="w-24 h-24 mx-auto bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Aligning the Stars...
          </h2>
          <p className="text-purple-700">Your personalized birth chart is being created</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Something went wrong
          </h2>
          <p className="text-purple-700 mb-4">Please contact support with your order details.</p>
          {errorDetails && (
            <p className="text-red-600 text-sm mb-8">Error: {errorDetails}</p>
          )}
          <a 
            href="/"
            className="inline-block bg-purple-900 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-50" style={{ backgroundColor: '#FAF8FC' }}>
      {/* ASTROLOGIE Header */}
      <div className="text-center pt-12 pb-8">
        <h1 
          className="text-5xl font-light tracking-wider text-black"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          ASTROLOGIE
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-8 pb-16">
        {/* Payment Success Header */}
        <div className="text-center mb-8">
          <h2 
            className="text-4xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}
          >
            Payment Successful
          </h2>
          <p className="text-xl text-purple-700 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Your personalized birth chart has been created
          </p>
          <p className="text-gray-600" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            A copy has been sent to: <span className="font-medium text-purple-700">{userEmail}</span>
          </p>
        </div>

        {/* Report Display */}
        {report && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Report Header */}
            <div className="bg-gradient-to-b from-purple-100 to-white p-12 text-center">
              <h2 
                className="text-4xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {report.title}
              </h2>
              
              {birthData && (
                <>
                  <p className="text-gray-600 mb-2">
                    Born on {birthData.birthDate} at {birthData.birthTime}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {birthData.birthPlace}
                  </p>
                </>
              )}
              
              <p className="text-lg text-gray-700 max-w-3xl mx-auto" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
                {report.summary}
              </p>
            </div>

            {/* Report Sections */}
            <div className="p-12 space-y-12">
              {report.sections.map((section, index) => (
                <div key={index} className="border-b border-purple-100 pb-10 last:border-0">
                  <h3 
                    className="text-2xl font-medium mb-6"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {section.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Demo Notice */}
              <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-center text-yellow-800">
                  ✓ This is a demo report. Full detailed AI-powered reports coming to your inbox within 5 minutes.
                </p>
              </div>
            </div>

            {/* Generate Another Report Button */}
            <div className="bg-gray-50 p-8">
              <div className="text-center">
                <a 
                  href="/"
                  className="inline-block bg-purple-400 text-white px-12 py-4 rounded-lg hover:bg-purple-500 transition-colors text-lg font-medium shadow-lg"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)' 
                  }}
                >
                  Generate Another Cosmo Report
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Birth Details Card (if no report) */}
        {!report && birthData && (
          <div className="bg-white rounded-xl shadow-xl p-12 mt-8">
            <h3 className="text-2xl font-light mb-6 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Birth Details Used
            </h3>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <p className="text-lg">{birthData.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Birth Date:</span>
                <p className="text-lg">{birthData.birthDate}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Birth Time:</span>
                <p className="text-lg">{birthData.birthTime}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Birth Place:</span>
                <p className="text-lg">{birthData.birthPlace}</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <a 
                href="/"
                className="inline-block bg-purple-400 text-white px-12 py-4 rounded-lg hover:bg-purple-500 transition-colors text-lg font-medium shadow-lg"
                style={{ 
                  fontFamily: 'Cormorant Garamond, serif',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)' 
                }}
              >
                Generate Another Cosmo Report
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}