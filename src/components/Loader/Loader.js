import React, { useEffect, useState } from 'react';
import './Loader.css';
import logo_site from './logo.png';

const Loader = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2000); // Задержка исчезновения

        const endTimer = setTimeout(() => {
            setLoading(false);
        }, 2500); // Полная задержка 2.5 секунд

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(endTimer);
        };
    }, []);

    if (!loading) {
        return null;
    }

    return (
        <div className={`cafe-site-loader ${fadeOut ? 'cafe-site-fade-out' : ''}`}>
            <div className="cafe-site-loader-content">
                <div className="cafe-site-loader-spinner">
                    <img src={logo_site} alt="Логотип сайта" />
                </div>
                <h2>Загрузка, пожалуйста, подождите...</h2>
            </div>
        </div>
    );
};

export default Loader;
