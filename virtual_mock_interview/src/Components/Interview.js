import React, { useEffect } from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import Webcam from "react-webcam";
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';


const Interview = () => {

    const [specificVariable, setSpecificVariable] = useState(false);

    // const toggleVideoButton = () => {
    //     setSpecificVariable(true);
    //     console.log("this is the toggle on");
    //     console.log(specificVariable);
    // }

    // const toggleVideoButtonOff = () => {
    //     setSpecificVariable(false);
    //     console.log("this is the toggle off");
    //     console.log(specificVariable);
    // }

    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn((prevState) => !prevState);
    
        // Call the appropriate function based on the toggle state
        if (!isOn) {
        // Function to execute when the toggle is turned on
        specificFunctionOn();
        } else {
        // Function to execute when the toggle is turned off
        specificFunctionOff();
        }
    };
    
    const specificFunctionOn = () => {
        setSpecificVariable(true);
        console.log("this is the toggle on");
        console.log(specificVariable);
    };
    
    const specificFunctionOff = () => {
        setSpecificVariable(false);
        console.log("this is the toggle off");
        console.log(specificVariable);
    };


    const [interviewId, setInterviewId] = useState('');

    useEffect(() => {
        const generatedInterviewId = uuidv4(); // Generate a random user ID
        setInterviewId(generatedInterviewId);
        setCookie('interview_id', generatedInterviewId, { path: '/' });
        
    }, []);



    const [cookies, setCookie] = useCookies(['job-field', 'interview_id']);
    const jobField = cookies['job-field'];
    const [questions, setQuestions] = useState([]);

    const client = axios.create({
        baseURL: "http://127.0.0.1:5000"
    });

    useEffect(() => {
        const fetchData = async () => {
        try {
            const endpoint = "/questions";
            const response = await client.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            params: {
                job_field: jobField
            },
            data: {}
            });
    
            const extractedQuestions = response.data.slice(0, 5).map(question => question.question_text);
            setQuestions(extractedQuestions);
        } catch (error) {
            console.error('Error:', error);
            // Handle error response here, such as displaying an error message to the user
        }
        };
    
        fetchData();
    }, [jobField]);

    const navigate = useNavigate();


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showFirstQuestion, setShowFirstQuestion] = useState(false);
    const currentQuestion = showFirstQuestion ? questions[currentQuestionIndex] : '';

    
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


    const handleDataAvailable = React.useCallback(({ data }) => {
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
        }
        }, []);


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
    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

    const handleStopCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef, setCapturing]);
        
        
    const handleSendToBackend = React.useCallback(() => {
        if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        const formData = new FormData();
        formData.append("video", blob, `${interviewId}_${counter - 1}_video.webm`);
        // add question to the form data
        formData.append("question", questions[counter - 2]);
        axios.post(`http://127.0.0.1:5000/video`, formData)
            .then(response => {
            console.log(response.data);
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
            navigate('/report');
        }
    };
    
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    

    const [timeRemaining, setTimeRemaining] = useState(60*2);
    const [displayTimer, setDisplayTimer] = useState(false);

    const [displayRunningLate, setDisplayRunningLate] = useState(false);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResetClick = () => {
        setTimeRemaining(60*2);
        setDisplayTimer(true);
        console.log(displayTimer);
    };

    const handleTimerEnd = () => {
        console.log('Timer reached zero!');
        MajorFunction();
    };

    const handleTimerLate = () => {
        console.log('Last ten seconds!');
        setDisplayRunningLate(true);
    };

    useEffect(() => {
        let interval = null;

        if (timeRemaining > 0 && displayTimer) {
            interval = setInterval(() => {
            setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        }

        if (timeRemaining === 0) {
            handleTimerEnd();
        }else if (timeRemaining === 10) {
            handleTimerLate();
        }

        return () => {
        clearInterval(interval);
        };
    }, [timeRemaining, displayTimer]);




    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // ------------------------------------------------------------


    useEffect(() => {
        console.log("we are inside reload effect", counter);
        
        const handleBeforeUnload = (event) => {
        if (counter !== 0) {
            event.preventDefault();
            event.returnValue = '';
            return 'Can not perform this action now';
        }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [counter]);


    function MajorFunction() {

            if (counter === 0) {
                firstStartCapturing();
                handleClick();
                sendAndChange2();
                setCounter(counter + 1);
                setButtonText('Next Question');
                console.log(counter);
                setDisplayRunningLate(false);
                handleResetClick();

            } else if (counter === 4) {
                nextQuestionCapturing();
                sendAndChange();
                setButtonText('End Interview');
                setCounter(counter + 1);
                console.log(counter);
                setDisplayRunningLate(false);
                handleResetClick();

            }
            else if (counter === 5) {
                nextQuestionCapturing();
                setIsClicked(false);
                sendAndChange();
                setButtonText('To Report Page');
                setDisplayRunningLate(false);
                setCounter(counter + 1);
                setDisplayTimer(false);
                console.log(counter);
                
            }
            else if (counter === 6) {
                console.log("i am in counter 6")
                lastQuestionCapturing();
                sendAndChange();
                
            }
            else {
                nextQuestionCapturing();
                sendAndChange();
                setCounter(counter + 1);
                console.log(counter);
                setDisplayRunningLate(false);
                handleResetClick();
            }
        
    }
    

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

        
            


    return (
        
        <>

            <div className="instructions-parent instructions-parent-for-interview" >
                
                <div className="instructions-container" >
                </div>



                <div className="question-container">
                    <div className="question-box question-box-for-interview">
                        <div className={`icons-holder-interview icons-for-interview  ${isClicked ? 'clicked' : ''}`}>
                            <div>
                                <i className="fas fa-video"></i>
                                <i className="fas fa-microphone"></i>
                            </div>
                            <div>
                                {/* <button onClick={toggleVideoButton} >show cam</button> */}
                                {/* <button onClick={toggleVideoButtonOff} >No cam</button> */}
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        onChange={handleToggle}
                                    />
                                    <span className="slider round" />
                                </label>
                                <span className="toggle-text">{isOn ? 'Video On' : 'Video Off'}</span>
                                <div className={`timer ${displayTimer ? 'timer-update' : ''}`} >{formatTime(timeRemaining)}</div>
                            </div>
                            
                        </div>
                        <div className= "running-container" >
                            <p className={`time-running ${displayRunningLate ? 'time-running-update' : ''}`} >Time Low</p>
                        </div>
                        <div className="question" id={`${specificVariable ? 'questionId' : 'questionId-without-video'}`} style={{ display: showFirstQuestion ? 'block' : 'none' }}>
                            {currentQuestion}
                        </div>

                        <Webcam className='interview-vid' audio={true} ref={webcamRef} muted={true} style={{ display: specificVariable ? 'block' : 'none' }} />
                        

                    </div>
                </div>

                <div className='link-container-for-example-page link-container-for-interview-page' >
                    <button className="button-start" onClick={MajorFunction} >{buttonText} <span className="triangle"></span></button>
                </div>




            </div>
        
        
        </>

    )

}


export default Interview