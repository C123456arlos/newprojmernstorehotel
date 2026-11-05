import mongoose from "mongoose"
const connectDB = () => {
    try {
        mongoose.connection.on('connected', () => console.log('database connected'))
<<<<<<< HEAD
        mongoose.connect(`${process.env.MONGODB_URI}/mernapp`)
=======
        mongoose.connect(`${process.env.MONGODB_URI}/my-new-app`)
>>>>>>> 6044a666a5a2c98c3039b4dcb0601504e3250155
    } catch (error) {
        console.log(error.message)
    }
}
export default connectDB
// import mongoose from "mongoose"
// const connectDB = () => {
//     try {
//         mongoose.connection.on('connected', () => console.log('database connected'))
//         mongoose.connect(`${process.env.MONGODB_URI}/new-app`)
//     } catch (error) {
//         console.log(error.message)
//     }
// }
// export default connectDB