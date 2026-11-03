// import React from 'react'
// import Navbar from './components/Navbar'
// import { Route, Routes, useLocation } from 'react-router-dom'
// import Home from './pages/Home'
// import Footer from './components/Footer'
// import AllRooms from './pages/AllRooms'
// import RoomDetails from './pages/RoomDetails'
// import MyBookings from './pages/MyBookings'
// import HotelReg from './components/HotelReg'
// import Layout from './pages/hotelOwner/Layout'
// import Dashboard from './pages/hotelOwner/Dashboard'
// import AddRoom from './pages/hotelOwner/AddRoom'
// import ListRoom from './pages/hotelOwner/ListRoom'
// import { Toaster } from 'react-hot-toast'
// import { useAppContext } from './context/AppContext'
// import Loader from './components/Loader'
// import { SignOutButton } from '@clerk/react'

// const App = () => {
//   const isOwnerPath = useLocation().pathname.includes('owner')
//   const { showHotelReg, rooms } = useAppContext()
//   return (
//     <div>
//       <Toaster></Toaster>
//       {!isOwnerPath && <Navbar></Navbar>}
        
//       {showHotelReg && <HotelReg></HotelReg>}
//       <div className='min-h-[70vh]'>
//         <Routes>
//           <Route path='/' element={<Home></Home>}></Route>
//           <Route path='/rooms' element={<AllRooms></AllRooms>}></Route>
//           <Route path='/rooms/:id' element={<RoomDetails></RoomDetails>}></Route>
//           <Route path='/my-bookings' element={<MyBookings></MyBookings>}></Route>
//           <Route path='/loader/:nextUrl' element={<Loader></Loader>}></Route>
//           <Route path='/owner' element={<Layout></Layout>}>
//             <Route index element={<Dashboard></Dashboard>}></Route>
//             <Route path='add-room' element={<AddRoom></AddRoom>}></Route>
//             <Route path='list-room' element={<ListRoom></ListRoom>}></Route>
//           </Route>
//         </Routes>
//       </div>
//       <Footer></Footer>
//     </div>
//   )
// }

// export default App




import { SignOutButton, useClerk } from '@clerk/react'
import React from 'react'

const App = () => {
  const {openSignIn} = useClerk()
  return (
    <div>
               <nav className={`fixed top-0 left-0  w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4`}>
        <SignOutButton></SignOutButton>

                        <button onClick={openSignIn} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 `}>
                            Login
                        </button>

        </nav>
    </div>
  )
}

export default App