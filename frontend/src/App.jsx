import React from 'react'
import LandingPage from './components/landingPage/landingPage'
import SinglePage from './components/singlePage/singlePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
      <div className='w-full overflow-hidden '>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/singlePage' element={<SinglePage />} />
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App;