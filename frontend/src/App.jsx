import react from 'react'
import Navbar from './component/navbar'
import Header from './component/header'
import Container from './component/container'
import House from './component/house'
import Contact from './component/contact'
import Footer from './component/footer'
import Review from './component/customerRating'
function App() {

  return (
    <div className='w-full overflow-hidden '>
      <Navbar />
      <Header />
      <Container />
      <House />
      <Review />
      <Contact />
      <Footer />
    </div>
  )
}

export default App