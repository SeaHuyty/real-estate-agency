import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import About from './components/About.jsx'
import LandingPage from './pages/client/landingPage'
import PropertyDetails from './components/houseListPage/PropertyDetails'
import Properties from './components/houseListPage/PropertyList.jsx'
import Contact from './components/Contact.jsx'
import LoginAdmin from './components/admin/LoginAdmin.jsx'
import RegisterAdmin from './components/admin/RegisterAdmin.jsx'
import CreateProperty from './pages/admin/CreateProperty.jsx'
import ManageProperties from './pages/admin/ManageProperties.jsx'
import ProtectedRouted from './components/admin/protectedRoute.jsx'
import UpdateProperty from './pages/admin/UpdateProperty.jsx'
import Analytics from './pages/admin/Analytics.jsx';
import CreateEmployee from './components/admin/CreateEmployee.jsx';
import ManageVisitRequests from './components/admin/ManageVisitRequests.jsx';
import VisitRequestDetail from './components/admin/VisitRequestDetails.jsx';
import EmployeeDashboard from './components/admin/EmployeeDashboard.jsx';
import Signup from './components/client/Signup.jsx';
import User from './components/client/User.jsx';
import UpdateEmployee from './components/admin/UpdateEmployee.jsx'
import RequestVisit from './components/houseListPage/RequestVisit.jsx';

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
            <Route path='/About' element={<About />} />
            <Route path='/login' element={<LoginAdmin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/user' element={<User />} />
            <Route path='/admin' element={<ProtectedRouted><Analytics /></ProtectedRouted>}/>
            <Route path='/admin/properties/create' element={<ProtectedRouted><CreateProperty /></ProtectedRouted> } />
            <Route path='/admin/properties/manage' element={<ProtectedRouted><ManageProperties /></ProtectedRouted> } />
            <Route path='/admin/edit/:id' element={<ProtectedRouted><UpdateProperty /></ProtectedRouted>} />
            <Route path='/admin/requests' element={<ProtectedRouted><ManageVisitRequests /></ProtectedRouted>} />
            <Route path='/admin/requests/:id' element={<ProtectedRouted><VisitRequestDetail /></ProtectedRouted>} />
            <Route path='/admin/register' element={<ProtectedRouted><RegisterAdmin /></ProtectedRouted>} />
            <Route path='/admin/employee' element={<ProtectedRouted><EmployeeDashboard /></ProtectedRouted>} />
            <Route path='/admin/createEmployee' element={<ProtectedRouted><CreateEmployee /></ProtectedRouted>} />
            <Route path='/admin/employee/:id' element={<ProtectedRouted><UpdateEmployee /></ProtectedRouted>} />
            <Route path='/properties/:id/request-visit' element={<RequestVisit />} />
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;