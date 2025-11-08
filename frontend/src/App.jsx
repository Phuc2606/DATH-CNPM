import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'
import Checkout from './pages/Checkout/Checkout'
import CheckoutSuccess from './pages/Checkout/CheckoutSuccess'
const App = () => {
  
  return (
    <div className='App'>
      <Routes>
        <Route path = '/' element={<Homepage/>}/>
  <Route path = '/checkout' element={<Checkout/>}/>
  <Route path = '/checkout/success' element={<CheckoutSuccess/>}/>
      </Routes>
    </div>
  )
}

export default App