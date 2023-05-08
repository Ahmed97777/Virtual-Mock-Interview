import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom"
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import Webcam from "react-webcam";


const Interview = () => {

    const navigate = useNavigate();

    const questionsArray = [
        "how are you?",
        "how is your day?",
        "how is your life?",
        "how is your family?",
        "why are you here right now?"
    ]


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showFirstQuestion, setShowFirstQuestion] = useState(false);
    const currentQuestion = showFirstQuestion ? questionsArray[currentQuestionIndex] : '';


    const sendAndChange = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    }

    const sendAndChange2 = () => {
        setShowFirstQuestion(true);
    }

    const [counter, setCounter] = useState(0);
    const [buttonText, setButtonText] = useState('Start Interview');

    const [isClicked, setIsClicked] = useState(false);
    const handleClick = () => {
        setIsClicked(true);
    }

    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // ------------------------------------------------------------

    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);

    const handleStartCaptureClick = React.useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm;codecs=vp9,opus"
    });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);
    
    
    const handleDataAvailable = React.useCallback(({ data }) => {
    if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
    }
    }, []);

    const handleStopCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);
        
        
    const handleSendToBackend = React.useCallback(() => {
        if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        const formData = new FormData();
        formData.append("video", blob, String((counter - 1)+"video.webm"));
        axios.post("http://127.0.0.1:5000/video", formData)
            .then(response => {
            // Handle the response from the backend
            })
            .catch(error => {
            // Handle the error
            });
        setRecordedChunks([]);
        }
    }, [recordedChunks]);

    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // i = 0 
    const firstStartCapturing = () => {
        if (capturing) {
            handleStopCaptureClick();
            console.log("capturing is set to true");
        }
        handleStartCaptureClick();
        console.log("First recording started");
    };

    const nextQuestionCapturing = async () => {
        if (capturing) {
            handleStopCaptureClick();
            console.log("Recording stopped");
            handleSendToBackend();
            console.log("Recording sent to backend");
        }
        handleStartCaptureClick();
        console.log("new question Recording started");
    };


    const lastQuestionCapturing = async () => {
        if (capturing) {
            handleStopCaptureClick();
            console.log("last question Recording stopped");
            handleSendToBackend();
            console.log("last question Recording sent to backend");
            // return <Link to="/report">Go to Report</Link>;
            navigate('/report');
        }
    };
    
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    
    

    function MajorFunction() {

            if (counter === 0) {
                handleClick();
                sendAndChange2();
                // start record
                firstStartCapturing();
                setCounter(counter + 1);
                setButtonText('Next Question');
                console.log(counter);
            } else if (counter === 4) {
                sendAndChange();
                setButtonText('End Interview');
                // stop record + send to backened + start tany
                nextQuestionCapturing();
                setCounter(counter + 1);
                console.log(counter);
            }else if (counter === 6) {
                // do something when counter is 5
                // console.log("this is counter 5 baby");
                // stop record + send to backend + go to report page
                // stop record + send to backened
                lastQuestionCapturing();
                // Navigate to report page
                

            } else {
                sendAndChange();
                // stop record + send to backened + start tany
                nextQuestionCapturing();
                setCounter(counter + 1);
                console.log(counter);
            }
        
    
        // rest of your code here
    }
    

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

        
            


    return (
        
        <>

            {/* <Webcam audio={true} ref={webcamRef} /> */}
            <Webcam audio={true} ref={webcamRef} style={{ display: 'none' }} />


            <div className="logo-container-for-config" >
                <div className="top-logo-menu-for-config" >
                    <a className="logo-name-for-config logo-name-for-interview" href="/" >VMI</a>
                </div>
            </div>

            <div className="instructions-parent instructions-parent-for-interview" >
                
                <div className="instructions-container" >
                    {/* <h2 className="main-title-2" >Interview Started:</h2> */}
                </div>



                <div className="question-container">
                    <div className="question-box question-box-for-interview">
                        <div className={`icons-holder icons-for-interview  ${isClicked ? 'clicked' : ''}`}>
                            <i className="fas fa-video"></i>
                            <i className="fas fa-microphone"></i>
                        </div>
                        <div className="question" id='questionId' style={{ display: showFirstQuestion ? 'block' : 'none' }}>{currentQuestion}</div>
                            {/* <div className='ex-start-holder' ><button className="ex-start" onClick={sendAndChange2} >Start Answer </button></div> */}
                            {/* <div className='ex-next-holder' ><button className="ex-next" onClick={sendAndChange} >Next question </button></div> */}
                            {/* <div className="question" id='questionId'>{currentQuestion}</div>
                            <div className='ex-start-holder' ><button className="ex-start" >Start Answer </button></div>
                            <div className='ex-next-holder' ><button className="ex-next" onClick={sendAndChange} >Next question </button></div> */}
                    </div>
                </div>

                <div className='link-container-for-example-page link-container-for-interview-page' >
                    <button className="button-start" onClick={MajorFunction} >{buttonText} <span className="triangle"></span></button>
                </div>


                {/* <Link to="/report" ><button className="button-start" >Start Interview <span className="triangle"></span></button></Link> */}



            </div>
        
        
        </>

    )

}


export default Interview
