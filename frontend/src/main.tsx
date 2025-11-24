import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './Pages/Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path='/' element={<App/>}/>
    <Route path='/auth' element={<Auth/>}/>
   </Routes>
  </BrowserRouter>
)
