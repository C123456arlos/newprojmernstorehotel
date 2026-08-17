import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner')
  return (
    <div>
      {!isOwnerPath && <Navbar></Navbar>}
      {false && <HotelReg></HotelReg>}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/rooms' element={<AllRooms></AllRooms>}></Route>
          <Route path='/rooms/:id' element={<RoomDetails></RoomDetails>}></Route>
          <Route path='/my-bookings' element={<MyBookings></MyBookings>}></Route>
          <Route path='/owner' element={<Layout></Layout>}>
            <Route index element={<Dashboard></Dashboard>}></Route>
            <Route path='add-room' element={<AddRoom></AddRoom>}></Route>
            <Route path='list-room' element={<ListRoom></ListRoom>}></Route>
          </Route>
        </Routes>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default App