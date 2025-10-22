import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
