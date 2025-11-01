import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
createRoot(document.getElementById('root')).render(
  
  <BrowserRouter  basename='/' >
    <App />
  </BrowserRouter>,
  
)
