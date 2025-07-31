import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Your new restricted key
const stripe = new Stripe('rk_test_51RqL1pCBZQndsJfhp5Ve4hfDpIIgwBHXhzP3IjbBq72puwGyL6bueMJi9fXHj01Xl1MNZ7VhPvjTIaWyXlTJAJaB00ay9QwNkH', {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const { formData, amount, promoCode } = await request.json()
    
    console.log('Received payment request:', { formData, amount, promoCode })
    
    // If test promo code, skip payment
    if (promoCode === 'TEST2024') {
      return NextResponse.json({ 
        url: `/success?session_id=test_${Date.now()}&test_mode=true` 
      })
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Astrological Birth Chart Analysis',
              description: 'Complete cosmic blueprint with 9 detailed sections',
            },
            unit_amount: 3999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/payment',
      customer_email: formData.email,
      metadata: {
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        email: formData.email,
      },
    })
    
    console.log('Stripe session created:', session.id)
    
    return NextResponse.json({ url: session.url })
    
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}
