'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ReportSection {
  icon: string;
  title: string;
  content: string;
}

interface Report {
  title: string;
  summary: string;
  sections: ReportSection[];
}

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const testMode = searchParams.get('test_mode') === 'true';
  
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('shefalimanojpatel@gmail.com'); // This would come from session/form data

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // In production, this would fetch the actual report based on sessionId
        // For demo, we'll use a sophisticated sample report
        const demoReport: Report = {
          title: "Cosmic Blueprint for Shefali Manoj Patel",
          summary: "The stars have aligned to reveal your extraordinary destiny. Your chart indicates rare cosmic signatures found only in the world's most successful individuals.",
          sections: [
            {
              icon: "👑",
              title: "Executive Summary",
              content: "Your astrological configuration reveals the cosmic DNA of a visionary leader. Born under powerful planetary alignments, you possess the rare combination of intuitive genius and strategic mastery that defines the ultra-successful."
            },
            {
              icon: "✨",
              title: "Dominant Celestial Signature",
              content: "You are 'The Cosmic Architect' - a rare archetype that appears once in a generation. Your power colors are deep purple and gold, resonating with wealth and wisdom. Your optimal timing for major decisions falls on Thursdays during the golden hour."
            },
            {
              icon: "💰",
              title: "Wealth Magnetism Profile",
              content: "Jupiter's exceptional placement in your chart indicates billionaire potential actualized between ages 35-42. March 2024 and September 2025 are your wealth acceleration windows. Your investment sweet spots align with technology, luxury goods, and transformative industries."
            },
            {
              icon: "🚀",
              title: "Leadership & Legacy Blueprint",
              content: "You're destined to influence millions through innovative ventures. Your genius zones include strategic foresight, pattern recognition, and catalyzing human potential. Industries aligned with your cosmic blueprint: AI, sustainable luxury, and consciousness technologies."
            },
            {
              icon: "🤝",
              title: "Power Partnerships",
              content: "Your ideal business partners carry strong Earth and Fire elements. Warning: avoid partnerships during Mercury retrograde. Your cosmic board should include Capricorn strategists, Leo visionaries, and Scorpio power brokers."
            },
            {
              icon: "💕",
              title: "Elite Love Compatibility",
              content: "Your romantic destiny involves a partner who matches your ambition and depth. Peak romance periods: May 2024 and December 2024. Your ideal partner profile: accomplished, spiritually evolved, and shares your vision for legacy."
            },
            {
              icon: "📊",
              title: "Strategic Life Seasons",
              content: "You're entering a 7-year wealth expansion cycle. Critical decision windows: April 15-30, 2024 and October 1-15, 2024. Major opportunity surge begins January 2025."
            },
            {
              icon: "🔮",
              title: "Exclusive 12-Month Forecast",
              content: "January-March 2024: Foundation setting. April-June 2024: Explosive growth phase. July-September 2024: Strategic consolidation. October-December 2024: Quantum leap opportunities. Launch ventures on new moons for maximum cosmic support."
            },
            {
              icon: "🧘",
              title: "Billionaire Mindset Activations",
              content: "Your power mantra: 'I am divinely guided to infinite abundance.' Daily practice: 5:55 AM meditation facing East. Your unique success formula: Intuition (40%) + Strategy (30%) + Timing (30%) = Inevitable Success."
            }
          ]
        };
        
        setReport(demoReport);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 
            className="text-7xl font-light tracking-wider text-black mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            ASTROLOGIE
          </h1>
          <div className="w-24 h-0.5 bg-purple-300 mx-auto"></div>
        </div>

        {/* Report Content */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your cosmic blueprint...</p>
          </div>
        ) : report ? (
          <>
            {/* Report Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
              <h2 
                className="text-3xl font-light mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {report.title}
              </h2>
              
              <p className="text-gray-600 mb-2" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                Born on January 10, 1994 at 12:58 PM EST
              </p>
              <p className="text-gray-600 mb-8" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                PARSIPANNY, NEW JERSEY, USA
              </p>
              
              <p 
                className="text-gray-700 italic leading-relaxed"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
              >
                {report.summary}
              </p>
            </div>

            {/* All Report Sections - Visible by Default */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              {report.sections.map((section, index) => (
                <div key={index} className="mb-12 last:mb-0">
                  <h3 
                    className="text-xl text-gray-500 mb-4 flex items-center"
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                  >
                    <span className="mr-3 text-2xl">{section.icon}</span>
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
              
              {/* Demo Notice */}
              <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-center text-gray-700" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                  ✅ This is a demo report. Full AI-powered reports coming soon!
                </p>
              </div>
            </div>

            {/* Email Confirmation Section */}
            <div className="text-center mb-12">
              <h3 
                className="text-2xl font-light mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Your Custom Cosmic Blueprint Has Been Generated
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                Check your inbox at <span className="font-medium">{userEmail}</span> in a few minutes
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Download Report Button */}
              {!testMode && (
                <button
                  className="w-full bg-purple-900 text-white py-5 text-lg tracking-widest uppercase rounded-lg shadow-lg hover:bg-purple-800 transition-all duration-300"
                  style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
                >
                  Download Full Report (PDF)
                </button>
              )}

              {/* Email Notice */}
              <div className="text-center py-6">
                <p className="text-gray-600 mb-2" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                  Your complete report has been emailed to you.
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                  Check your inbox (and spam folder) within 5 minutes.
                </p>
              </div>

              {/* Generate Another Report Button */}
              <Link href="/">
                <button
                  className="w-full bg-purple-100 text-purple-900 py-5 text-lg tracking-widest uppercase rounded-lg shadow hover:bg-purple-200 transition-all duration-300"
                  style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
                >
                  Generate Another Report
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">Unable to load report. Please try again.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-purple-600" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
            © 2024 Astrologie. Celestial Insights for the Elite.
          </p>
        </div>
      </div>
    </div>
  );
}