import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received body:', body)
    
    const { formData, amount, promoCode } = body
    
    // If TEST2024 promo code, use test success page
    if (promoCode === 'TEST2024') {
      console.log('TEST2024 promo code detected!')
      
      const params = new URLSearchParams({
        sessionId: "test_session_" + Date.now(),
        userId: "test_user_" + Date.now(),
        purchaseId: "test_purchase_" + Date.now(),
        test_mode: "true"
      })
      
      // Use test-success page for TEST2024
      return NextResponse.json({ url: "/test-success?" + params.toString() })
    }
    
    // For real payments, would use /success page
    // This would include actual Stripe integration
    return NextResponse.json({ error: "Payment not implemented" }, { status: 400 })
    
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
