import mongoose from "mongoose"
const connectDB = () => {
    try {
        mongoose.connection.on('connected', () => console.log('database connected'))
        mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        console.log(error.message)
    }
}
export default connectDB