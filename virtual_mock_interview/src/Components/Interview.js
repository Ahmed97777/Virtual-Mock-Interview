import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom"
import axios from "axios";

const Interview = () => {


    const questionsArray = [
        "how are you?",
        "how is your day?",
        "how is your life?",
        "how is your family?",
        "why are you here right now?"
    ]


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questionsArray[currentQuestionIndex];


    const sendAndChange = () => {
        
        setCurrentQuestionIndex(currentQuestionIndex + 1);


    }



    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

        // const client = axios.create({
        //     baseURL: "http://127.0.0.1:5000"
        // });

        // const [videoFile, setVideoFile] = useState([]);

        // const addToArray = () => {
        //     setVideoFile(prev => [...prev, videoFile]);
        //     };

        //     const sendToBackEnd = () => {
        //     const endpoint = "/field";
        //     client.post(endpoint, {'field': videoFile})
        //     .then(response => {
        //     console.log('Success:', response);
        //     // Handle success response here, such as displaying a success message to the user
        //     })
        //     .catch(error => {
        //     console.error('Error:', error);
        //     // Handle error response here, such as displaying an error message to the user
        //     });
        //     }

            


    return (

        <>

            <div className="logo-container-for-config" >
                <div className="top-logo-menu-for-config" >
                    <a className="logo-name-for-config logo-name-for-interview" href="/" >VMI</a>
                </div>
            </div>

            <div className="instructions-parent instructions-parent-for-interview" >
                
                <div className="instructions-container" >
                    <h2 className="main-title-2" >Interview Started:</h2>
                </div>



                <div className="question-container">
                    <div className="question-box question-box-for-interview">
                        <div className="icons-holder icons-for-interview">
                            <i className="fas fa-video"></i>
                            <i className="fas fa-microphone"></i>
                        </div>
                        <div className="question" id='questionId'>{currentQuestion}</div>
                        <div className='ex-start-holder' ><button className="ex-start" >Start Answer </button></div>
                        <div className='ex-next-holder' ><button className="ex-next" onClick={sendAndChange} >Next question </button></div>
                    </div>
                </div>

                <div className='link-container-for-example-page link-container-for-interview-page' >
                    <Link to="/report" ><button className="button-start" >End Interview <span className="triangle"></span></button></Link>
                </div>




            </div>
        
        
        
        
        
        
        
        
        
        </>

    )

}


export default Interview
