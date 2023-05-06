import React, { useEffect } from 'react';
import axios from "axios";
import { useState } from 'react';
import { Link } from "react-router-dom"
import Webcam from "react-webcam";



const VideoApi = () => {

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
    formData.append("video", blob, "react-webcam-stream-capture.webm");
    axios.post("/api/upload-video", formData)
        .then(response => {
        // Handle the response from the backend
        })
        .catch(error => {
        // Handle the error
        });
    setRecordedChunks([]);
    }
}, [recordedChunks]);


    return (
    <>
        <Webcam audio={true} ref={webcamRef} />

        {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        
        {recordedChunks.length > 0 && (
        <button onClick={handleSendToBackend}>Send to Backend</button>
        )}
    </>
    );
};


export default VideoApi
