import React from 'react'
import Navbar from './navbar'
import Header from './header'
import Container from './container'
import Footer from './footer'

const landingPage = () => {
    return (
        <div className='w-full overflow-hidden '>
            <Navbar />
            <Header />
            <Container />
            <Footer />
        </div>
    )
}

export default landingPage