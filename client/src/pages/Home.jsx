import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/Latestcollection'
import Policies from '../components/Policies'
const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <Policies />
    </div>
  )
}

export default Home