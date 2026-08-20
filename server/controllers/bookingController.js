import sendSimpleMessage from "../configs/mailgun.js"
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"
import Mailgun from "mailgun.js"
import FormData from "form-data"

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
        const user = req.user._id
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        if (!isAvailable) {
            return res.json({ success: false, messsage: 'room is not available' })
        }
        // const roomData = await Room.findById(room)
        const roomData = await Room.findById(room).populate('hotel')
        console.log(roomData, 'testestest')
        let totalPrice = roomData.pricePerNight
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
        totalPrice *= nights
        const booking = await Booking.create({
            user,
            room,
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
        async function sendSimpleMessage() {
            const mailgun = new Mailgun(FormData);
            const mg = mailgun.client({
                username: "api",
                key: process.env.API_KEY || "API_KEY",
                // When you have an EU-domain, you must specify the endpoint:
                // url: "https://api.eu.mailgun.net"
            })
            try {
                const data = await mg.messages.create("sandboxd334b10d3325498ea7885978c47ecc91.mailgun.org", {
                    from: "Mailgun Sandbox <postmaster@sandboxd334b10d3325498ea7885978c47ecc91.mailgun.org>",
                    to: process.env.SENDER_EMAIL,
                    subject: 'hotel booking details',
                    html: `
            <h2>your booking details</h2>
            <p>dear  ${req.user.username}, </p>
            <p>>thank you for your booking here are the details:</p>
            <ul>
            <li><strong>booking ID: <strong>${booking._id}</li>
            <li><strong>hotel name: <strong>${roomData.hotel.name}</li>
            <li><strong>location: <strong>${roomData.hotel.address}</li>
            <li><strong>date: <strong>${booking.checkInDate.toDateString()}</li>
            <li><strong>booking amount: <strong>${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
            </ul>
            <p>we look forward to welcoming you</p>
            <p>if you need to make any changes feel free to contact us</p>
            `
                });

                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        sendSimpleMessage()
        res.json({ success: true, message: 'booking created successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id
        const bookings = await Booking.find({ user }).populate('room hotel').sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: 'failed to fetch bookings' })
    }
}
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId })
        if (!hotel) {
            return res.json({ success: false, message: 'no hotel found' })
        }
        const bookings = await Booking.false({ hotel: hotel._id }).populate('room hotel user').sort({ createdAt: -1 })
        const totalBookings = bookings.length
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)
        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: 'failed to fetch bookings' })
    }
}
