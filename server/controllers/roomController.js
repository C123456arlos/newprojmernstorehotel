import Hotel from "../models/Hotel.js"
import { v2 as cloudinary } from 'cloudinary'
import Room from "../models/Room.js"
import User from "../models/User.js"


export const createRoom = async (req, res) => {
    try {
        const { clerkUserId } = req.user
        const { roomType, pricePerNight, amenities } = req.body
        const { _id } = req.user
        const owner = req.user._id
        // const hotel = await Hotel.find()
        // const hotel = await Hotel.findById({ _id: _id })
        const hotel = await Hotel.findOneAndUpdate({
            owner: {
                _id: req.user._id,
            }
        })
        console.log(hotel)
        const ownerHotel = await User.findOneAndUpdate({
            clerkUserId
        }, { name: owner.name, image: owner.image })
        // const userHotel = await Hotel.findOneAndUpdate({
        //     owner: { _id: req.user._id }
        // }, {
        //     owner: { owner: { image: ownerHotel.image } }
        // })
        console.log(ownerHotel, 'testtestestst')
        // console.log(hotel, '1234567890test')
        // console.log(ownerHotel, '123testtststest')
        // const hotel = await Hotel.findOne({ owner: { owner: req.auth.userId } })
        // const hotel = await Hotel.findOne({ owner })
        if (!hotel) return res.json({ success: false, message: 'no hotel found' })
        console.log(hotel)
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path)
            return response.secure_url
        })
        const images = await Promise.all(uploadImages)
        await Room.create({
            hotel: {
                _id: hotel._id,
                image: ownerHotel.image
            },
            // {
            //     owner: { image: ownerHotel.image }
            // },

            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images
        })
        res.json({ success: true, message: 'room created successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner.owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })
        res.json({ success: true, rooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId })
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate('hotel')
        res.json({ success: true, rooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body
        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable
        await roomData.save()
        res.json({ success: true, message: 'room availability updated' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
