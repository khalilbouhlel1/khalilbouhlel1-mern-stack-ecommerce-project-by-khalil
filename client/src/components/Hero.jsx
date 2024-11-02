import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'

const Hero = () => {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out"
      }
    )
    .fromTo(textRef.current,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
      },
      "-=0.5"
    )
    .fromTo(buttonRef.current,
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      },
      "-=0.3"
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      <div className='container mx-auto flex flex-col items-center justify-center h-screen px-4 space-y-12'>
        <h1 
          ref={titleRef}
          className='text-6xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500'
        >
          Welcome to FripiKa
        </h1>
        
        <p 
          ref={textRef}
          className='text-xl md:text-2xl text-center text-gray-600 max-w-2xl'
        >
          Discover the latest trends in fashion with our curated collection
        </p>

        <Link 
          ref={buttonRef}
          to="/collection"
          className='inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full 
                     text-lg font-semibold text-white cursor-pointer
                     transform transition-all duration-300 
                     hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20
                     active:scale-95'
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}

export default Hero