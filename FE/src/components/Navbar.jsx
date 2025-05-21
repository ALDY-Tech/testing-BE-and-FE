import React from 'react'

const Navbar = () => {
  return (
    <nav className=" font-montserrat font-bold p-4 shadow-2xs flex justify-start relative border border-t-0 border-l-0 border-r-0 border-b-[1px] border-[#DEDAD2] bg-white">
      <h1 className="text-4xl sm:text-6xl flex cursor-pointer select-none">
        <span className="text-yellow hover:text-yellow-600 transition-colors duration-300">Kre
        </span>
        <span className="text-blue hover:text-blue-950 transition-colors duration-300">Tools
        </span>
      </h1>
    </nav>
  )
}

export default Navbar