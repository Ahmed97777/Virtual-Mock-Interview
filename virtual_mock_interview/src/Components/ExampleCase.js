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

    const client = axios.create({
        baseURL: "http://127.0.0.1:5000/softwareQuestions"
    });


    const [posts, setPosts] = useState([]);

    useEffect(() => {
        client.get('?_limit=10').then((response) => {
            setPosts(response.data);
        });
        }, []);



    return (

        <>
        
        
            <div className="logo-container-for-config" >
                <div className="top-logo-menu-for-config" >
                    <a className="logo-name-for-config" href="/" >VMI</a>
                </div>
            </div>
            
            <div className="instructions-parent" >
                
                <div className="instructions-container" >
                    <h2 className="main-title-2" >How to start the interview:</h2>
                    <h2 className="main-title-2" >3- Answer questions as shown below:</h2>
                </div>



                <div className="question-container">
                    <div className="question-box">
                        <div className={`icons-holder ${isClicked ? 'clicked' : ''}`}>
                            <i className="fas fa-video"></i>
                            <i className="fas fa-microphone"></i>
                        </div>
                        <div className="question">Example: What is your biggest strength?</div>
                        <div className='ex-start-holder' ><button className="ex-start" onClick={handleClick} >1- Start Answer </button></div>
                        <div className='ex-next-holder' ><button className="ex-next" >2- Next question </button></div>
                    </div>
                </div>

                <div className='link-container-for-example-page' >
                    <Link to="/interview" ><button className="button-start" >Begin Interview <span className="triangle"></span></button></Link>
                </div>




            </div>

            

            
            
            
            
            
        </>


    )


}

export default ExampleCase
