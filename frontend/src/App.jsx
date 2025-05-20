import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './components/landingPage/landingPage'
import SinglePage from './components/singlePage/singlePage'
import Properties from './components/houseListPage/properties'

function App() {
  return (
    <BrowserRouter>
      <div className='w-full overflow-hidden '>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/property/:id' element={<SinglePage />} />
            <Route path='/properties/:province' element={<Properties />} />
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;