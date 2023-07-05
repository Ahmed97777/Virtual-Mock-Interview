import React, { useState } from 'react'
import { useEffect } from 'react';
import { Link } from "react-router-dom"
import axios from "axios";

const ExampleCase = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);
    
    const [isClicked, setIsClicked] = useState(false);
    const handleClick = () => {
        setIsClicked(true);


    }

    return (

        <>
        
            
            <div className="instructions-parent" >
                
                <div className="instructions-container" >
                    <h2 className="main-title-2" >Example on how to start the interview:</h2>
                    <h2 className="main-title-2" >3- Answer questions as shown below:</h2>
                </div>



                <div className="question-container">
                    <div className="question-box">
                        <div className={`icons-holder ${isClicked ? 'clicked' : ''}`}>
                            <i className="fas fa-video"></i>
                            <i className="fas fa-microphone"></i>
                        </div>
                        <div className="question">Example: What is your biggest strength?</div>
                        <div className='ex-start-holder' ><button className="ex-start" onClick={handleClick} >Start Answer </button></div>
                       
                    </div>
                </div>

                <div className='link-container-for-example-page' >
                    <Link to="/interview" ><button className="button-start" >Go to Interview page <span className="triangle"></span></button></Link>
                </div>




            </div>

            

            
            
            
            
            
        </>


    )


}

export default ExampleCase
