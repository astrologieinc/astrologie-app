'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51ODb0NEniiD0lGWuqBLhS04yGCXrq4QHql5P1uOydKGOIf1hr9ItLwOcCFuXo8pJQzG7br08oq3pkMiRwq2hsVrk00bHqfD6kG');

export default function Payment() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Get form data from URL params (passed from main form)
  const formData = {
    name: searchParams.get('name') || '',
    birthDate: searchParams.get('birthDate') || '',
    birthTime: searchParams.get('birthTime') || '',
    birthPlace: searchParams.get('birthPlace') || '',
    email: searchParams.get('email') || ''
  };

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

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Create payment session
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formData,
          amount: 39.99,
          promoCode: ''
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment session creation failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Error processing payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 
            className="text-7xl font-light tracking-wider text-black mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            ASTROLOGIE
          </h1>
          <p 
            className="text-lg italic text-black"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
          >
            Millionaires don't use Astrologie — Billionaires do.
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-purple-900 text-white p-8 text-center">
            <h2 
              className="text-3xl font-light mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Complete Your Order
            </h2>
            <p className="text-purple-100" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
              Your personalized cosmic blueprint awaits
            </p>
          </div>

          {/* Order Summary */}
          <div className="p-8">
            <h3 
              className="text-xl font-semibold text-gray-800 mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Order Summary
            </h3>

            {/* Customer Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-4" 
                  style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                Birth Chart Details
              </h4>
              <div className="space-y-2 text-gray-700" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                <p><span className="text-gray-500">Name:</span> {formData.name}</p>
                <p><span className="text-gray-500">Birth Date:</span> {formData.birthDate}</p>
                <p><span className="text-gray-500">Birth Time:</span> {formData.birthTime}</p>
                <p><span className="text-gray-500">Birth Place:</span> {formData.birthPlace}</p>
                <p><span className="text-gray-500">Email:</span> {formData.email}</p>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-800" 
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Premium Astrological Birth Chart Analysis
                  </h4>
                  <p className="text-sm text-gray-600 mt-1" 
                     style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                    Complete cosmic blueprint with 9 detailed sections
                  </p>
                </div>
                <p className="text-2xl font-light text-gray-800" 
                   style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  $39.99
                </p>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-4" 
                  style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                What's Included
              </h4>
              <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  Complete 9-section personalized birth chart analysis
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  Wealth magnetism and success timing insights
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  12-month cosmic forecast
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  PDF report delivered instantly to your email
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-purple-900 text-white py-5 text-lg tracking-widest uppercase rounded-lg shadow-lg hover:bg-purple-800 transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </div>
              ) : (
                'Proceed to Secure Payment'
              )}
            </button>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                🔒 Secure payment powered by Stripe
              </p>
              <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-8 text-center">
          <p className="text-sm text-purple-700" style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}>
            30-Day Money Back Guarantee • Instant Delivery
          </p>
        </div>
      </div>
    </div>
  );
}