import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { birthData } = await request.json()
    
    // Extract birth information
    const { name, birthDate, birthTime, birthPlace } = birthData
    
    // Create a detailed prompt for Claude - Enhanced Billionaire Edition
    const prompt = `You are the world's most exclusive astrologer, serving only the ultra-wealthy elite. Your readings have guided billionaires, royalty, and titans of industry. Create a premium, deeply personalized astrological analysis that reflects the caliber of Astrologie's clientele.

CLIENT DETAILS:
Name: ${name}
Birth Date: ${birthDate}
Birth Time: ${birthTime}
Birth Place: ${birthPlace}

CONTEXT: This person has invested in Astrologie's premium service because they understand that celestial wisdom is the secret edge of the ultra-successful. They expect insights that go beyond common astrology.

Generate a luxurious, comprehensive report with these sections:

1. **Executive Summary** - A powerful 2-3 sentence overview of their cosmic CEO potential

2. **Dominant Celestial Signature** 
   - Their primary astrological archetype (e.g., "The Cosmic Mogul", "The Intuitive Innovator")
   - Power colors, stones, and timing for maximum influence

3. **Wealth Magnetism Profile**
   - Specific periods in 2024-2025 for major financial breakthroughs
   - Investment timing based on their Jupiter and Venus placements
   - Their "billionaire potential" indicators

4. **Leadership & Legacy Blueprint**
   - How they're destined to influence the world
   - Their unique genius zones
   - Optimal industries/ventures aligned with their chart

5. **Power Partnerships**
   - The astrological profiles that amplify their success
   - Warning signs in business partnerships
   - Their "cosmic board of advisors" profile

6. **Elite Love Compatibility**
   - The caliber of partner that matches their frequency
   - Relationship patterns of the ultra-successful
   - Timing for significant romantic developments

7. **Strategic Life Seasons**
   - Their 7-year wealth cycles
   - Critical decision windows in the next 24 months
   - Power moves aligned with planetary support

8. **Exclusive Forecast: Next 12 Months**
   - Month-by-month power periods
   - Specific dates for launching ventures
   - Warnings about challenging periods

9. **Billionaire Mindset Activations**
   - Mantras based on their chart
   - Daily practices for cosmic alignment
   - Their unique success formula

Make this feel like a $10,000 consultation. Use language that's sophisticated yet accessible. Include specific dates, percentages, and actionable insights. Reference how other billionaires with similar placements found success.

The tone should be: Confident, exclusive, empowering, and slightly mystical without being vague.

Format as an elegant JSON object for display.`;

    // Call Claude API (in production, you'd use proper API keys)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    // Extract the report from Claude's response
    const reportText = data.content[0].text;
    
    // Parse the report (assuming Claude returns JSON)
    let report;
    try {
      report = JSON.parse(reportText);
    } catch (e) {
      // If not JSON, create a structured report from the text
      report = {
        title: `Cosmic Blueprint for ${name}`,
        summary: "Your personalized astrological analysis reveals profound insights about your destiny.",
        sections: [
          {
            title: "Your Astrological Profile",
            content: reportText
          }
        ]
      };
    }

    return NextResponse.json({ 
      success: true, 
      report: report 
    });

  } catch (error) {
    console.error('Report generation error:', error);
    
    // Enhanced fallback report for demo purposes - Billionaire Edition
    const name = request.body?.birthData?.name || 'Seeker';
    const fallbackReport = {
      title: `Cosmic Blueprint for ${name}`,
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
          title: "❤️ Elite Love Compatibility",
          content: "Your romantic destiny involves a partner who matches your ambition and depth. Peak romance periods: May 2024 and December 2024. Your ideal partner profile: accomplished, spiritually evolved, and shares your vision for legacy."
        },
        {
          title: "📊 Strategic Life Seasons",
          content: "You're entering a 7-year wealth expansion cycle. Critical decision windows: April 15-30, 2024 and October 1-15, 2024. Major opportunity surge begins January 2025."
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
    
    return NextResponse.json({ 
      success: true, 
      report: fallbackReport,
      demo: true 
    });
  }
}