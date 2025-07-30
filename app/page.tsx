'use client';

import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51ODb0NEniiD0lGWuqBLhS04yGCXrq4QHql5P1uOydKGOIf1hr9ItLwOcCFuXo8pJQzG7br08oq3pkMiRwq2hsVrk00bHqfD6kG');

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    birthCoordinates: { lat: 0, lng: 0 },
    email: '',
    promoCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showCustomTimePicker, setShowCustomTimePicker] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ day: 10, month: 1, year: 1994 });
  const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 58, ampm: 'PM', timezone: 'EST' });

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const timezones = ['UTC', 'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'JST', 'AEST'];

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
    // Update formData when date picker changes
    if (selectedDate.day && selectedDate.month && selectedDate.year) {
      const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, birthDate: formattedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    // Update formData when time picker changes
    const formattedTime = `${selectedTime.hour}:${String(selectedTime.minute).padStart(2, '0')} ${selectedTime.ampm} ${selectedTime.timezone}`;
    setFormData(prev => ({ ...prev, birthTime: formattedTime }));
  }, [selectedTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Store birth data in localStorage for the success page
      const birthData = {
        name: formData.name,
        birthDate: `${months[selectedDate.month - 1]} ${selectedDate.day}, ${selectedDate.year}`,
        birthTime: `${selectedTime.hour}:${selectedTime.minute.toString().padStart(2, '0')} ${selectedTime.ampm} ${selectedTime.timezone}`,
        birthPlace: formData.birthPlace,
        email: formData.email
      };
      localStorage.setItem('birthData', JSON.stringify(birthData));
      
      // If promo code is TEST2024, redirect directly to success page
      if (formData.promoCode === 'TEST2024') {
        // Bypass payment for testing
        window.location.href = `/success?session_id=test_${Date.now()}&test_mode=true`;
        return;
      }
      
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formData,
          amount: 39.99,
          promoCode: formData.promoCode
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment session creation failed');
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error processing payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ScrollPicker = ({ items, value, onChange, label }: any) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    
    // Auto-scroll to selected item on mount and value change
    useEffect(() => {
      if (scrollRef.current && value !== undefined) {
        const index = items.findIndex((item: any) => item === value);
        if (index !== -1) {
          const itemHeight = 48; // h-12 = 48px
          const scrollPosition = index * itemHeight;
          scrollRef.current.scrollTop = scrollPosition;
        }
      }
    }, [value, items]);

    return (
      <div ref={containerRef} className="relative h-32 overflow-hidden bg-white rounded-xl shadow-sm">
        {/* Very light purple selection zone - positioned exactly in the middle */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="h-full flex items-center justify-center">
            <div className="w-full h-12 relative">
              <div className="absolute inset-0 bg-purple-500/[0.05]"></div>
              <div className="absolute top-0 left-4 right-4 h-[1px] bg-purple-400/30"></div>
              <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-purple-400/30"></div>
            </div>
          </div>
        </div>
        
        {/* Gradient overlays for fade effect */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none"></div>
        
        {/* Scrollable items with proper padding */}
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide"
          style={{ 
            scrollBehavior: 'smooth'
          }}
        >
          {/* Top padding to center first item */}
          <div style={{ height: '40px' }}></div>
          
          {items.map((item: any, index: number) => {
            const isSelected = value === item;
            
            return (
              <div
                key={`${item}-${index}`}
                onClick={() => {
                  onChange(item);
                  // Scroll to center the selected item
                  if (scrollRef.current) {
                    const itemHeight = 48;
                    const scrollPosition = index * itemHeight;
                    scrollRef.current.scrollTop = scrollPosition;
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`h-12 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'text-black text-lg font-medium' 
                    : hoveredIndex === index
                    ? 'text-gray-700 text-base'
                    : 'text-gray-400 text-base'
                }`}
                style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}
              >
                {label ? label(item) : item}
              </div>
            );
          })}
          
          {/* Bottom padding to center last item */}
          <div style={{ height: '40px' }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-purple-50" style={{ backgroundColor: '#FAF8FC' }}>
      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Logo and Tagline */}
        <div className="text-center mb-16">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <label 
              className="block text-black text-sm tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-purple-200 text-black text-xl focus:outline-none focus:border-purple-400 transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your Full Name"
            />
          </div>

          {/* Birth Date */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <label 
              className="block text-black text-sm tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              Birth Date
            </label>
            <div 
              onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-purple-200 text-black text-xl cursor-pointer focus:outline-none focus:border-purple-400 transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {selectedDate.month ? `${months[selectedDate.month - 1]} ${selectedDate.day}, ${selectedDate.year}` : 'Select Date'}
            </div>
            
            {showCustomDatePicker && (
              <div className="mt-6">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <p className="text-xs text-black uppercase tracking-wider text-center" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>MONTH</p>
                  <p className="text-xs text-black uppercase tracking-wider text-center" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>DAY</p>
                  <p className="text-xs text-black uppercase tracking-wider text-center" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>YEAR</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <ScrollPicker 
                    items={months.map((_, i) => i + 1)} 
                    value={selectedDate.month} 
                    onChange={(m: number) => setSelectedDate({...selectedDate, month: m})}
                    label={(m: number) => months[m - 1]}
                  />
                  <ScrollPicker 
                    items={days} 
                    value={selectedDate.day} 
                    onChange={(d: number) => setSelectedDate({...selectedDate, day: d})}
                  />
                  <ScrollPicker 
                    items={years} 
                    value={selectedDate.year} 
                    onChange={(y: number) => setSelectedDate({...selectedDate, year: y})}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Birth Time */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <label 
              className="block text-black text-sm tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              Birth Time & Timezone
            </label>
            <div 
              onClick={() => setShowCustomTimePicker(!showCustomTimePicker)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-purple-200 text-black text-xl cursor-pointer focus:outline-none focus:border-purple-400 transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {`${selectedTime.hour}:${selectedTime.minute.toString().padStart(2, '0')} ${selectedTime.ampm} ${selectedTime.timezone}`}
            </div>
            
            {showCustomTimePicker && (
              <div className="mt-6">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <p className="text-xs text-black uppercase tracking-wider text-center" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>HOUR</p>
                  <p className="text-xs text-black uppercase tracking-wider text-center" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>MINUTE</p>
                  <p className="text-xs text-black uppercase tracking-wider text-center" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>AM/PM</p>
                  <p className="text-xs text-black uppercase tracking-wider text-center" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>ZONE</p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <ScrollPicker 
                    items={hours} 
                    value={selectedTime.hour} 
                    onChange={(h: number) => setSelectedTime({...selectedTime, hour: h})}
                  />
                  <ScrollPicker 
                    items={minutes} 
                    value={selectedTime.minute} 
                    onChange={(m: number) => setSelectedTime({...selectedTime, minute: m})}
                    label={(m: number) => m.toString().padStart(2, '0')}
                  />
                  <ScrollPicker 
                    items={['AM', 'PM']} 
                    value={selectedTime.ampm} 
                    onChange={(a: string) => setSelectedTime({...selectedTime, ampm: a})}
                  />
                  <ScrollPicker 
                    items={timezones} 
                    value={selectedTime.timezone} 
                    onChange={(t: string) => setSelectedTime({...selectedTime, timezone: t})}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Birth Place */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <label 
              className="block text-black text-sm tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              Birth Place & Location
            </label>
            <input
              type="text"
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-purple-200 text-black text-xl focus:outline-none focus:border-purple-400 transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              value={formData.birthPlace}
              onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
              placeholder="City, Country"
            />
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <label 
              className="block text-black text-sm tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
            >
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-purple-200 text-black text-xl focus:outline-none focus:border-purple-400 transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
            />
          </div>

          {/* Promo Code - Hidden by default */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowPromoCode(!showPromoCode)}
              className="text-purple-600 text-sm underline hover:text-purple-700 transition-colors"
              style={{ fontFamily: 'Avenir, -apple-system, sans-serif' }}
            >
              {showPromoCode ? 'Hide promo code' : 'Have a promo code? (Use TEST2024 for testing)'}
            </button>
          </div>

          {showPromoCode && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <label 
                className="block text-black text-sm tracking-widest uppercase mb-4"
                style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
              >
                Promo Code
              </label>
              <input
                type="text"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-purple-200 text-black text-xl focus:outline-none focus:border-purple-400 transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                value={formData.promoCode}
                onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
                placeholder="Enter code"
              />
              {formData.promoCode === 'TEST2024' && (
                <p className="mt-2 text-green-600 text-sm">✓ Test mode activated - payment will be skipped</p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-900 text-white py-5 text-lg tracking-widest uppercase rounded-lg shadow-lg hover:bg-purple-800 transition-all duration-300 disabled:opacity-50"
            style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </div>
            ) : formData.promoCode === 'TEST2024' ? (
              'Generate My Birth Chart – FREE (Test Mode)'
            ) : (
              'Generate My Birth Chart – $39.99'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-purple-600" style={{ fontFamily: 'Avenir, -apple-system, sans-serif', fontWeight: 300 }}>
            © 2024 Astrologie. Celestial Insights for the Elite.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}