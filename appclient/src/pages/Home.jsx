import React from 'react'
import Hero from '../components/Hero'
import FeatureDestination from '../components/FeatureDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import RecommendedHotels from '../components/RecommendedHotels'

const Home = () => {
    return (
        <>
            <Hero></Hero>
            {/* <RecommendedHotels></RecommendedHotels>
            <FeatureDestination></FeatureDestination>
            <ExclusiveOffers></ExclusiveOffers> */}
            <Testimonial></Testimonial>
            <NewsLetter></NewsLetter>
        </>
    )
}

export default Home