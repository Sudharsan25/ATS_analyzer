import React from 'react'
import { Link } from 'react-router'

const NavBar = () => {
  return (
    <nav className='navbar'>
        <Link to='/'>
            <p className='text-2xl font-bold text-gradient'>ATS Resume analyzer</p>
        </Link>
        <Link to="/upload">
            <p className='primary-button'>
                Upload your resume
            </p>
        </Link>
    </nav>
  )
}

export default NavBar