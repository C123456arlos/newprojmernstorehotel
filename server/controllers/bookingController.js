import sendSimpleMessage from "../configs/mailgun.js"
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"
import stripe from 'stripe'

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        })
        const isAvailable = bookings.length === 0
        return isAvailable
    } catch (error) {
        console.error(error.message)
    }
}
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        res.json({ success: true, isAvailable })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body
        console.log(room, 'roomAAA1122')
        console.log(req.user, 'usernamenameconsolelo2224555g')
        const user = req.user._id
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        if (!isAvailable) {
            return res.json({ success: false, messsage: 'room is not available' })
        }
        const roomData = await Room.findById(room)
        // const roomData = await Room.findById(room).populate('hotel')
        console.log(roomData, 'testestest')
        // const roomHotelType = roomData.roomType
        let totalPrice = roomData.pricePerNight
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
        totalPrice *= nights
        const booking = await Booking.create({
            user: {

                username: req.user.username,
            },
            room: {
                images: roomData.images,
                _id: roomData._id,
                roomType: roomData.roomType
            },
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })
        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL,
        //     to: process.env.SENDER_EMAIL,
        //     subject: 'hotel booking details',
        //     html: `
        //     <h2>your booking details</h2>
        //     <p>dear  ${req.user.username}, </p>
        //     <p>>thank you for your booking here are the details:</p>
        //     <ul>
        //     <li><strong>booking ID: <strong>${booking._id}</li>
        //     <li><strong>hotel name: <strong>${roomData.hotel.name}</li>
        //     <li><strong>location: <strong>${roomData.hotel.address}</li>
        //     <li><strong>date: <strong>${booking.checkInDate.toDateString()}</li>
        //     <li><strong>booking amount: <strong>${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
        //     </ul>
        //     <p>we look forward to welcoming you</p>
        //     <p>if you need to make any changes feel free to contact us</p>
        //     `
        // }
        // await transporter.sendMail(mailOptions)
        // await sendSimpleMessage()
        // async function sendSimpleMessage() {
        //     const mailgun = new Mailgun(FormData);
        //     const mg = mailgun.client({
        //         username: "api",
        //         key: process.env.API_KEY || "API_KEY",
        //         // When you have an EU-domain, you must specify the endpoint:
        //         // url: "https://api.eu.mailgun.net"
        //     })
        //     try {
        //         const data = await mg.messages.create("sandboxd334b10d3325498ea7885978c47ecc91.mailgun.org", {
        //             from: "Mailgun Sandbox <postmaster@sandboxd334b10d3325498ea7885978c47ecc91.mailgun.org>",
        //             to: process.env.SENDER_EMAIL,
        //             subject: 'hotel booking details',
        //             html: `
        //     <h2>your booking details</h2>
        //     <p>dear  ${req.user.username}, </p>
        //     <p>>thank you for your booking here are the details:</p>
        //     <ul>
        //     <li><strong>booking ID: <strong>${booking._id}</li>
        //     <li><strong>hotel name: <strong>${roomData.hotel.name}</li>
        //     <li><strong>location: <strong>${roomData.hotel.address}</li>
        //     <li><strong>date: <strong>${booking.checkInDate.toDateString()}</li>
        //     <li><strong>booking amount: <strong>${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
        //     </ul>
        //     <p>we look forward to welcoming you</p>
        //     <p>if you need to make any changes feel free to contact us</p>
        //     `
        //         });

        //         console.log(data)
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // sendSimpleMessage()
        res.json({ success: true, message: 'booking created successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
export const getUserBookings = async (req, res) => {
    console.log(req.user.clerkUserId)
    try {
        const user = req.user._id

        console.log(user, 'user')
        const bookings = await Booking.find({ user }).populate('hotel')
        // const bookings = await Booking.find({ user }).populate('room hotel').sort({ createdAt: -1 })
        // console.log(bookings, 'bookings')
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: 'failed to fetch bookings' })
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        console.log(req.auth, 'teststestestes2222')
        const hotel = await Hotel.findOne({ owner: req.auth.userId })
        const owner = await Hotel.find()
        console.log(owner, 'owner')
        console.log(hotel, 'hotel')
        if (!hotel) {
            return res.json({ success: false, message: 'no hotel found' })
        }
        // const bookings = await Booking.false({ hotel: hotel._id }).populate('room hotel user').sort({ createdAt: -1 })
        // const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        const bookings = await Booking.find()
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        const totalBookings = bookings.length
        res.json({ success: true, dashboardData: { totalBookings, bookings, totalRevenue } })
        // res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: 'failed to fetch bookings' })
    }
}
export const stripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body
        const booking = await Booking.findById(bookingId)
        const roomData = await Room.findById(booking.room).populate('hotel')
        const totalPrice = booking.totalPrice
        const { origin } = req.headers
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        const line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: roomData.hotel.name
                    },
                    unit_amount: totalPrice * 100
                },
                quantity: 1
            }
        ]
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata: {
                bookingId,
            }
        })
        res.json({ success: true, url: session.url })
    } catch (error) {
        res.json({ success: false, message: 'payment failed' })
    }
}