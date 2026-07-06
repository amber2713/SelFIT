import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/posture', label: 'Posture' },
    { path: '/tutorial', label: 'Tutorial' },
    { path: '/community', label: 'Social' },
    { path: '/buddy', label: 'Buddy' },
    { path: '/profile', label: 'Me' }
  ]

  return (
    <nav className="mobile-navbar">
      {menuItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path} 
          className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}
        >
          <span style={{ fontSize: '18px', marginBottom: '2px' }}>⚡</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navbar