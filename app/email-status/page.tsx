'use client';

import { useState } from 'react';

export default function EmailStatus() {
  const [result, setResult] = useState('');

  const sendSimpleTest = async () => {
    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'astrologieinc@gmail.com',
          name: 'Simple Test',
          report: { 
            title: 'Test Email ' + Date.now(),
            summary: 'This is a test at ' + new Date().toLocaleString()
          }
        })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult('Error: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <h1 className="text-3xl mb-4">Simple Email Test</h1>
      
      <button 
        onClick={sendSimpleTest}
        className="bg-green-500 text-white px-6 py-3 rounded text-lg mb-4"
      >
        Send Test Email to astrologieinc@gmail.com
      </button>
      
      <div className="bg-white p-4 rounded">
        <pre>{result}</pre>
      </div>
    </div>
  );
}
