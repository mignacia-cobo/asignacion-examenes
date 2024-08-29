import React from 'react';
import './Home.css';
import App from '../../App';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function Home() {
    return (
        <form className="home-form">
            <div className="image-container">
                <img src='/logo.png' alt="Logo" />
            </div>
        </form>
    );
  }
  
  
  export default Home;