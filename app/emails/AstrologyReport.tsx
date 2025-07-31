import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AstrologyReportEmailProps {
  name: string;
  reportUrl?: string;
}

export const AstrologyReportEmail = ({
  name = 'Seeker',
  reportUrl = 'https://astrologie.app/report',
}: AstrologyReportEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Premium Astrological Birth Chart Analysis is Ready</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>ASTROLOGIE</Heading>
          
          <Text style={text}>Dear {name},</Text>
          
          <Text style={text}>
            Your personalized cosmic blueprint has been divinely crafted. The stars have revealed extraordinary insights about your destiny, wealth potential, and life path.
          </Text>

          <Section style={buttonContainer}>
            <Link
              style={button}
              href={reportUrl}
            >
              View Your Full Report
            </Link>
          </Section>

          <Text style={text}>
            Your report includes:
          </Text>
          
          <Text style={list}>
            ✨ Executive Summary of your cosmic CEO potential<br />
            💰 Wealth Magnetism Profile with billionaire indicators<br />
            🚀 Leadership & Legacy Blueprint<br />
            ❤️ Elite Love Compatibility analysis<br />
            📊 Strategic Life Seasons forecast<br />
            🔮 Exclusive 12-month predictions<br />
            And much more...
          </Text>

          <Text style={footer}>
            © 2024 Astrologie. Celestial Insights for the Elite.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#FAF8FC',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '48px',
  fontWeight: '300',
  letterSpacing: '0.2em',
  lineHeight: '48px',
  margin: '0 0 30px',
  textAlign: 'center' as const,
};

const text = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '26px',
};

const list = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '26px',
  marginLeft: '10px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#5e2e84',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  lineHeight: '48px',
  padding: '0 30px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '30px',
  textAlign: 'center' as const,
};

export default AstrologyReportEmail;
EOFcat > app/api/send-report/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AstrologyReportEmail } from '@/app/emails/AstrologyReport';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, report } = await request.json();

    // For now, we'll send the email with a link
    // Later we can add PDF attachment
    const { data, error } = await resend.emails.send({
      from: 'Astrologie <noreply@astrologie.app>',
      to: [email],
      subject: 'Your Premium Astrological Birth Chart Analysis',
      react: AstrologyReportEmail({ name }),
      text: `Your cosmic blueprint is ready! View your full report at https://astrologie.app/report`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
