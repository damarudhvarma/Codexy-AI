
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>
  
)
