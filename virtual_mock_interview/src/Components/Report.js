import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useCookies } from 'react-cookie';

const Report = () => {

    const [cookies] = useCookies(['interview_id']);
    const [results, setResults] = useState([]);

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
    function getVideoAnalysis(videoId) {
      return new Promise((resolve, reject) => {
        const retryDelay = 30000; // 30 seconds
        const retry = () => {
          axios
            .get(`http://127.0.0.1:5000/report?interview_id=${cookies['interview_id']}&video_id=${videoId}`)
            .then(response => {
              increaseProgress();
              resolve(response.data);
            })
            .catch(error => {
              // Retry after the specified delay
              setTimeout(retry, retryDelay);
            });
        };
    
        retry(); // Start the initial request
      });
    }
    
    useEffect(() => {
      async function fetchData() {
        const videoIds = ['_1_video', '_2_video', '_3_video', '_4_video', '_5_video'];
        for (const videoId of videoIds) {
          const data = await getVideoAnalysis(videoId);
          setResults(prevResults => [...prevResults, data]);
        }
      }
      fetchData();
    }, []);
    
    useEffect(() => {
      console.log(results);
    }, [results]);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
              const fill = document.querySelector('.progress-bar-fill');
              const text = document.querySelector('.progress-text');
          
              fill.style.width = progress + '%';
              text.textContent = progress + '%';
            }, [progress]);
          
    const increaseProgress = () => {
              setProgress(prevProgress => prevProgress + 20);
            };




    return (

        <>


            <div className="instructions-parent report-container" >
                
                <div className="instructions-container"  >
                    <h2 className="main-title-2 report-title" >Report:</h2>
                </div>

            </div>


            <div className="wrapper">
                <div className="progress-bar">
                <span className="progress-bar-fill"></span>  
                </div>
                <span className="progress-text">Download starting...</span>
            </div>
        
        
        
        
        
        </>

    )
}


export default Report
