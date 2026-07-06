import React from 'react'
import render from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/animation.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)