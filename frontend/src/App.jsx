import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/landingPage/landingPage'
import PropertyDetails from './components/houseListPage/PropertyDetails'
import Properties from './components/houseListPage/properties'
import LoginAdmin from './components/authentication/loginAdmin'
import Contact from './components/landingPage/contact'
import AdminDashboard from './components/admin/AdminDashboard'
import CreateProperty from './components/admin/CreateProperty'
import ManageProperties from './components/admin/ManageProperties'

function App() {
  return (
    <BrowserRouter>
      <div className='w-full overflow-hidden '>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/properties/:id' element={<PropertyDetails />} />
            <Route path='/properties' element={<Properties />} />
            <Route path='/loginAdmin' element={<LoginAdmin />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin/properties/create' element={<CreateProperty />} />
            <Route path='/admin/properties/manage' element={<ManageProperties />} />
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;