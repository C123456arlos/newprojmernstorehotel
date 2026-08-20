import express from 'express'
import { protect, protectOwner } from '../middleware/authMiddleware.js'
import {
    // changeRoleToOwner,
    registerHotel
} from '../controllers/hotelController.js'
const hotelRouter = express.Router()
hotelRouter.post('/', protect, registerHotel)
// hotelRouter.post('/change', protect, changeRoleToOwner)
export default hotelRouter