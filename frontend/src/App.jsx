import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/landingPage/landingPage'
import SinglePage from './components/singlePage/singlePage'
import PropertyDetails from './components/houseListPage/PropertyDetails'
import Properties from './components/houseListPage/properties'

function App() {
  return (
    <BrowserRouter>
      <div className='w-full overflow-hidden '>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/properties/:id' element={<PropertyDetails />} />
            <Route path='/properties' element={<Properties />} />
            <Route path='/SinglePage' element={<SinglePage />} />
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;