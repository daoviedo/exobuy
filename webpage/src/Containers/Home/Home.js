import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Home.css';
import Logo from './homelogo.png';
import Banner1 from './homebanner.jpg';
import Banner2 from './homebanner2.png';

function Home() {
    return (
        <header>     
                <div className="b2">
                    <img src={Banner2} alt="Logo" className="banner2" />
                </div>
                <img src={Logo} alt="Logo" className="logo" />
                <div className="space"/>
                <div className="b1">
                    <img src={Banner1} alt="Logo" className="banner1" />
                </div>
                <div className="space"/>
        </header>
    );
}

export default Home;