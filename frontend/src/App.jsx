import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'
import Checkout from './pages/Checkout/Checkout'
import CheckoutSuccess from './pages/Checkout/CheckoutSuccess'
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
const App = () => {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path = '/' element={<Homepage/>}/>
  <Route path = '/checkout' element={<Checkout/>}/>
  <Route path = '/checkout/success' element={<CheckoutSuccess/>}/>
      </Routes>
    </div>
  );
};

export default App;
