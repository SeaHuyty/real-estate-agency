import React from 'react'
import Navbar from '../../components/Navbar'
import Header from '../../components/Header'
import Container from '../../components/Container'
import Footer from '../../components/Footer'

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