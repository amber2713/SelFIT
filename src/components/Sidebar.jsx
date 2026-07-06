import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/posture', label: 'AI Posture' },
    { path: '/tutorial', label: 'AI Tutorial' },
    { path: '/community', label: 'Community' },
    { path: '/buddy', label: 'Gym Buddy' },
    { path: '/profile', label: 'Profile' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">SelFIT</div>
      <nav style={{ flex: 1 }}>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar