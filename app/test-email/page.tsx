'use client';

export default function TestEmail() {
  const sendEmail = async () => {
    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'astrologieinc@gmail.com',  // CHANGED TO YOUR RESEND EMAIL
          name: 'Test User',
          report: { 
            title: 'Test Cosmic Blueprint',
            summary: 'This is a test email from your Astrologie app! IT WORKS!'
          }
        })
      });
      
      const result = await response.json();
      alert('Result: ' + JSON.stringify(result));
      console.log('Email result:', result);
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <button
          onClick={sendEmail}
          className="bg-purple-900 text-white px-12 py-6 rounded-lg text-2xl hover:bg-purple-800"
        >
          SEND TEST EMAIL NOW
        </button>
        <p className="mt-4 text-gray-600">Email will be sent to: astrologieinc@gmail.com</p>
      </div>
    </div>
  );
}
