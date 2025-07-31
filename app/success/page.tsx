'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState('generating'); // 'generating', 'sent', 'error'
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Auto-send on page load
    sendReport();
  }, []);

  const sendReport = async () => {
    try {
      setPhase('generating');
      
      const birthData = JSON.parse(localStorage.getItem('birthData') || '{}');
      console.log('Sending report for:', birthData);
      
      // Generate report
      const reportRes = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthData })
      });
      const reportData = await reportRes.json();
      
      // Send email
      const emailRes = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: birthData.email || 'astrologieinc@gmail.com',
          name: birthData.name || 'User',
          report: reportData.report
        })
      });
      
      const emailData = await emailRes.json();
      console.log('Email result:', emailData);
      
      if (emailData.success) {
        setPhase('sent');
      } else {
        throw new Error(emailData.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to send report');
      setPhase('error');
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-purple-50" style={{ backgroundColor: '#FAF8FC' }}>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-light tracking-wider text-black mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            ASTROLOGIE
          </h1>
        </div>

        {phase === 'generating' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg">Channeling cosmic wisdom...</p>
            <p className="text-sm text-gray-600 mt-2">Generating and sending your report...</p>
          </div>
        )}
        
        {phase === 'sent' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-semibold mb-2">Report Sent Successfully!</h2>
              <p className="text-gray-700">Check your email at astrologieinc@gmail.com</p>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-purple-600 text-lg italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Your cosmic blueprint has been delivered
              </p>
            </div>
          </>
        )}
        
        {phase === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-8">
            <p>Error: {error}</p>
            <button 
              onClick={sendReport}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="bg-purple-100 rounded-lg p-8 text-center">
          <Link href="/" className="inline-block bg-purple-900 text-white py-3 px-8 rounded-lg hover:bg-purple-800 transition-colors">
            Generate Another Report
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
