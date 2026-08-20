import Hotel from "../models/Hotel.js";
import User from "../models/User.js"
import { getAuth } from "@clerk/express"
export const registerHotel = async (req, res) => {

    try {
        const { name, address, contact, city } = req.body
        const { _id } = req.user
        // const owner = await User.findById({ _id })

        const owner = req.user._id
        // const owner = req.user.clerkUserId
        // const owner = req.user

        const role = req.user.role
        const hotel = await User.findOneAndUpdate({ role }, { role: 'hotelOwner' })
        // const hotel = await Hotel.findOne({ owner })
        const hotelOwner = await User.find()
        console.log(owner, 'testestestestestes')
        // if (hotel) {
        //     return res.json({ success: false, message: 'hotel already registered' })
        // }
        await Hotel.create({
            name, address, contact, city,
            // owner,

            owner: {
                _id: req.user.clerkUserId
            }

            // image: req.user.image,
            // email: req.user.email,
        })
        await User.findByIdAndUpdate(owner, { role: 'hotelOwner' })
        res.json({ success: true, message: 'hotel registered successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// export const changeRoleToOwner = async (req, res) => {
//     try {
//         const { _id } = req.user
//         const { status } = req.body
//         const booking = await Booking.findById(bookingId)

//         await User.findByIdAndUpdate(_id, { role: 'hotelOwner' })

//         if (booking.owner.toString() !== _id.toString()) {
//             return res.json({ success: false, message: 'unauthorized' })
//         }
//         booking.status = status
//         await booking.save()
//         res.json({ success: true, message: 'status updated' })
//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// export const changeRoleToOwner = async (req, res) => {

//     try {
//         const { clerkUserId } = req.user
//         const role = await User.findByIdAndUpdate(clerkUserId, { role: 'hotelOwner' })
//         // const owner = req.user._id
//         // const role = req.user.role
//         // const hotel = await Hotel.findOne({ owner })


//         res.json({ success: true, message: 'hotel registered successfully', role })
//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }


// export const changeRoleToOwner = async (req, res) => {
//     try {
//         const { _id } = req.user
//         const userId = req.owner
//         console.log(userId, 'test')
//         await User.findByIdAndUpdate(userId, { role: 'hotelOwner' })
//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }