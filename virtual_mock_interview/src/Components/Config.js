import React, { useState, useEffect, useRef} from 'react';
import { Link } from "react-router-dom"
import {useNavigate} from 'react-router-dom';
import Webcam from "react-webcam";

const Config = () => {
    const navigate = useNavigate();   
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const webcamRef = useRef(null);
    const audioFlag = false
    
    const [hasUserMediaError, setHasUserMediaError] = useState(false);
    const onUserMediaError = () => {
        setHasUserMediaError(true);
    }

    function checkVideo() {
        if (hasUserMediaError){
            const alertBox = document.createElement('div');
            alertBox.classList.add('custom-alert');
            alertBox.textContent = 'Please allow access for camera and mic permission to continue';
            document.body.appendChild(alertBox);

            setTimeout(() => {
            alertBox.remove();
            }, 2000);
        }
        else {
            navigate('/field');
        }
    }

    return (

        <>

            <div className="instructions-parent" >
            
                <div className="instructions-container" >
                    <h2 className="main-title-2" >How to start the interview:</h2>
                    <h2 className="main-title-2" >1- Please allow access for camera and mic permission:</h2>
                </div>


            </div>



            {/* Starting the configuration process */}


            <div className="config-container">
                <div className="config-box">
                {hasUserMediaError ? (
                    <img src="/video-logo-removebg-preview.png" alt="no video" className="config-img" />
                ) : (
                    <Webcam className= "web-cam" audio={audioFlag}  ref={webcamRef} muted={true} onUserMediaError={onUserMediaError} />
                )}
                </div>
                <button className="button-start" onClick={checkVideo}>Next choose your field <span className="triangle"></span></button>
            </div>



            {/* Ending the configuration process */}


        
        
        </>
    );

}

export default Config
