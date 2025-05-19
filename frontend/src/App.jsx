import react from 'react'
import Navbar from './components/landingPage/navbar'
import Header from './components/landingPage/header'
import Container from './components/landingPage/container'
import Footer from './components/landingPage/footer'
import HouseList from './components/listPage/HouseList'
import SinglePage from './components/singlePage/singlePage'

function App() {

  return (
    <div className='w-full overflow-hidden '>
      <Navbar />
      {/* <Header />
      <Container /> */}
      <SinglePage />
      <Footer />
      {/* <HouseList /> */}
    </div>
  )
}

export default App;