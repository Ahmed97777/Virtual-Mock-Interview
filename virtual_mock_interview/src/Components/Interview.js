import React, { useEffect } from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import Webcam from "react-webcam";
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';


const Interview = () => {


    const [userId, setUserId] = useState('');

    useEffect(() => {
        const generatedUserId = uuidv4(); // Generate a random user ID
        setUserId(generatedUserId);
    }, []);



    const [cookies] = useCookies(['job-field']);
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
        formData.append("video", blob, `${userId}_${jobField}_${counter - 1}_video.webm`);
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
    

    const [timeRemaining, setTimeRemaining] = useState(20);
    const [displayTimer, setDisplayTimer] = useState(false);

    const [displayRunningLate, setDisplayRunningLate] = useState(false);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResetClick = () => {
        setTimeRemaining(20);
        setDisplayTimer(true);
        console.log(displayTimer);
    };

    const handleTimerEnd = () => {
        // Perform the desired action when the timer reaches zero
        console.log('Timer reached zero!');
        MajorFunction();
        // Call your function here
        // ...
    };

    const handleTimerLate = () => {
        console.log('Last ten seconds!');
        setDisplayRunningLate(true);
    };

    useEffect(() => {
        let interval = null;

        if (timeRemaining > 0 && displayTimer) { // Only start timer if displayTimer is true
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
                // stop record + send to backened + start tany
                setCounter(counter + 1);
                
                console.log(counter);
                setDisplayRunningLate(false);
                handleResetClick();
            }
            else if (counter === 5) {
                // do something when counter is 5
                // console.log("this is counter 5 baby");
                // stop record + send to backend + go to report page
                // stop record + send to backened
                nextQuestionCapturing();
                setIsClicked(false);
                sendAndChange();
                setButtonText('To Report Page');
                setCounter(counter + 1);
                setDisplayTimer(false);
                console.log(counter);
                // Navigate to report page
                
            }
            else if (counter === 6) {
                // do something when counter is 5
                // console.log("this is counter 5 baby");
                // stop record + send to backend + go to report page
                // stop record + send to backened
                console.log("i am in counter 6")
                lastQuestionCapturing();
                sendAndChange();
                // Navigate to report page
                
            }
            else {
                nextQuestionCapturing();
                sendAndChange();
                // stop record + send to backened + start tany
                setCounter(counter + 1);
                
                console.log(counter);
                setDisplayRunningLate(false);
                handleResetClick();
            }
        
    
        // rest of your code here
    }
    

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

        
            


    return (
        
        <>

            {/* <Webcam audio={true} ref={webcamRef} /> */}
            <Webcam audio={true} ref={webcamRef} muted={true} style={{ display: 'none' }} />


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
                        <div className={`icons-holder-interview icons-for-interview  ${isClicked ? 'clicked' : ''}`}>
                            <div>
                                <i className="fas fa-video"></i>
                                <i className="fas fa-microphone"></i>
                            </div>
                            <div>
                                <div className={`timer ${displayTimer ? 'timer-update' : ''}`} >{formatTime(timeRemaining)}</div>
                                {/* <button onClick={handleResetClick}>Reset</button> */}
                            </div>
                            
                        </div>
                        <div className= "running-container" >
                            <p className={`time-running ${displayRunningLate ? 'time-running-update' : ''}`} >Time Low</p>
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
