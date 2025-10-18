import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'
const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path = '/' element={<Homepage/>}/>
      </Routes>
    </div>
  )
}

export default App
