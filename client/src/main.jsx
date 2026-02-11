import { createRoot } from 'react-dom/client'
import './index.css'  // @import "tailwindcss" 
import App from './App.jsx'  // mantine styles
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
