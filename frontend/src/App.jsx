  import React from 'react'
  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import { ToastContainer } from 'react-toastify';
  import LandingPage from './components/landingPage/landingPage'
  import PropertyDetails from './components/houseListPage/PropertyDetails'
  import Properties from './components/houseListPage/properties'
  import Contact from './components/landingPage/contact'
  import LoginAdmin from './components/admin/loginAdmin'
  import RegisterAdmin from './components/admin/registerAdmin'
  import AdminDashboard from './components/admin/AdminDashboard'
  import CreateProperty from './components/admin/CreateProperty'
  import ManageProperties from './components/admin/ManageProperties'
  import ProtectedRouted from './components/admin/protectedRoute'
  import UpdateProperty from './components/admin/UpdateProperty'
  import Analytics from './components/admin/Analytics';
  import ManageVisitRequests from './components/admin/ManageVisitRequests';
  import CreateEmployee from './components/admin/createEmployee';
  import EmployeeDashboard from './components/admin/EmployeeDashboard';

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
              <Route path='/hr' element={<EmployeeDashboard />} />
              <Route path='/hr/createEmployee' element={<CreateEmployee />} />
              <Route path='/admin' element={<ProtectedRouted><AdminDashboard /></ProtectedRouted>}/>
              <Route path='/admin/properties/create' element={<ProtectedRouted><CreateProperty /></ProtectedRouted> } />
              <Route path='/admin/properties/manage' element={<ProtectedRouted><ManageProperties /></ProtectedRouted> } />
              <Route path='/admin/edit/:id' element={<ProtectedRouted><UpdateProperty /></ProtectedRouted>} />
              <Route path='/admin/analytics' element={<Analytics />} />
              <Route path='/admin/requests' element={<ProtectedRouted><ManageVisitRequests /></ProtectedRouted>} />
              <Route path='/admin/register' element={<ProtectedRouted><RegisterAdmin /></ProtectedRouted>} />
            </Routes>
        </div>
      </BrowserRouter>
    )
  }

  export default App;