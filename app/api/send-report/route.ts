import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, report } = await request.json();
    
    console.log('Attempting to send email to:', email);
    console.log('Using API key:', process.env.RESEND_API_KEY ? 'Key is set' : 'NO KEY FOUND');
    
    const { data, error } = await resend.emails.send({
      from: 'Astrologie <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Premium Astrological Birth Chart Analysis',
      text: `Dear ${name},\n\nYour personalized cosmic blueprint has been generated!\n\nCheck the attached report for your complete astrological analysis.\n\n© 2024 Astrologie`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #5e2e84; text-align: center;">ASTROLOGIE</h1>
          <h2>Dear ${name},</h2>
          <p>Your personalized cosmic blueprint has been generated!</p>
          <h3>${report?.title || 'Your Astrological Report'}</h3>
          <p style="font-style: italic;">${report?.summary || 'Check your detailed analysis below.'}</p>
          <hr style="border: 1px solid #e0e0e0;">
          <p style="text-align: center; color: #888;">© 2024 Astrologie. Celestial Insights for the Elite.</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    );
  }
}
