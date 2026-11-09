import stripe from 'stripe'
import Booking from '../models/Booking.js'
import { Purchase}  from '../models/Purchase.js'
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers['stripe-signature']
    let event
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig,
            'whsec_NqQP0hfnCvOzNZO2b9BowWMZsbNf5N4B')
    } catch (error) {
        response.status(400).send(`${error.message}`)
    }
    try {
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object
            const paymentIntentId = paymentIntent.id
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata
            const purchases = await Purchase.findOne()
            const purchasesId = purchases._id
            const purchase = await Purchase.findById(purchasesId)
            purchase.status = 'completed'
            await purchases.save()
        } else {
            console.log('unhandled event type', event.type)
        }
        response.json({ received: true })
    } catch (error) {
        console.log('stripe error', error)
        response.status(400).send(`${error.message}`)
    }
}