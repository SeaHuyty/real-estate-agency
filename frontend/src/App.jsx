import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import LandingPage from './components/landingPage/landingPage'
import PropertyDetails from './components/houseListPage/PropertyDetails'
import Properties from './components/houseListPage/properties'
import Contact from './components/landingPage/contact'
import LoginAdmin from './components/admin/loginAdmin'
import AdminDashboard from './components/admin/AdminDashboard'
import CreateProperty from './components/admin/CreateProperty'
import ManageProperties from './components/admin/ManageProperties'
import ProtectedRouted from './components/admin/protectedRoute'
import UpdateProperty from './components/admin/UpdateProperty'
import Analytics from './components/admin/Analytics';

function App() {
  return (
    <BrowserRouter>
      <div className='w-full overflow-hidden '>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/properties/:id' element={<PropertyDetails />} />
            <Route path='/properties' element={<Properties />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path='/login' element={<LoginAdmin />} />

            <Route 
              path='/admin' 
              element={<ProtectedRouted><AdminDashboard /></ProtectedRouted>}/>
              <Route 
                path='/admin/properties/create' 
                element={<ProtectedRouted><CreateProperty /></ProtectedRouted> } />
              <Route 
              path='/admin/properties/manage' 
              element={<ProtectedRouted><ManageProperties /></ProtectedRouted> } />
              <Route
                path='/admin/edit/:id'
                element={<ProtectedRouted><UpdateProperty /></ProtectedRouted>} />
                <Route path='/admin/analytics' element={<Analytics />} />
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;