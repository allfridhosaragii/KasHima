import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './aurora.css'
import './quiet.css'
import './clarity.css'
import './audit-v10.css'
const element=document.getElementById('root')
if(!element)throw new Error('Root element is missing')
createRoot(element).render(<StrictMode><App/></StrictMode>)
