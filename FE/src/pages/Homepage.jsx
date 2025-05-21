import React from 'react'
import Navbar from '../components/Navbar'
import logo from '../assets/logo.png'
import content1 from '../assets/content1.jpg'
import content2 from '../assets/content2.jpg'
import content3 from '../assets/content3.jpg'

const Homepage = () => {
  return (
    <div className='min-h-screen w-full bg-white overflow-x-hidden '>
      <Navbar />
        {/* Section 1 */}
      <div className='HeroSection grid grid-cols-1 md:grid-cols-2 items-center justify-center min-h-[calc(100vh-80px)] px-6 md:px-16 gap-12'>

        {/* Kiri */}
        <div className="flex justify-center md:justify-center">
          <div className="max-w-md">
            <h1 className="font-poppins text-3xl md:text-5xl font-semibold text-black leading-snug">
              <span className='text-5xl md:text-6xl'>Turning </span>
              <span className='text-yellow'>creative</span> work <span className='text-5xl md:text-6xl'>ideas</span> into simple web <span className='text-blue'>tools</span>.
            </h1>

            <div className='flex flex-col sm:flex-row sm:space-x-4 items-center my-10'>
              <div className='bg-[#7DBEFF] rounded-full px-6 py-3 font-poppins text-lg cursor-pointer hover:bg-[#DEDAD2] transition-all duration-300'>
                Contact us!
              </div>
              <a className='mt-4 sm:mt-0 underline text-lg cursor-pointer' href='/login'>See demo</a>
            </div>

            <div className='relative my-4'>
              <div className='relative z-10 bg-gradient-to-tr from-yellow to-[#fff8cd] text-center rounded-xl h-32 flex items-center justify-center w-full px-5'>
                <h1 className='font-montserrat font-semibold'>
                  One-time payment for lifetime access
                </h1>
              </div>
              <div className='relative  z-0 bg-gradient-to-tl from-blue to-[#c3c2e9] shadow-xl rounded-xl h-20 -mt-18  mx-auto items-center w-[95%]'></div>
            </div>
          </div>
        </div>

        {/* Kanan */}
        <div className='flex flex-col items-center justify-center h-full'>
          <img src={logo} alt="logo" height={300} width={500} className="mb-6" />

{/* Stacked "hand of cards" style images */}
<div className="relative flex gap-0 w-fit mt-8">
  <img
    src={content1}
    alt="content1"
    className="w-[180px] md:w-[220px] rounded-xl shadow-lg z-30 relative -rotate-3 object-cover"
    style={{ marginLeft: '0px' }}
  />
  <img
    src={content2}
    alt="content2"
    className="w-[180px] md:w-[220px] rounded-xl shadow-lg z-20 relative rotate-0 object-cover"
    style={{ marginLeft: '-60px' }} // overlap sekitar 35%
  />
  <img
    src={content3}
    alt="content3"
    className="w-[180px] md:w-[220px] rounded-xl shadow-lg z-10 relative rotate-3 object-cover"
    style={{ marginLeft: '-60px' }} // overlap juga
  />
</div>
        </div>
      </div>


      {/* Section2 */}
      <div className='w-screen h-screen overflow-x-hidden bg-yellow font-montserrat text-blue font-bold'>hi</div>
    </div>
  )
}

export default Homepage
