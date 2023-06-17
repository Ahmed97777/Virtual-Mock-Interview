import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useCookies } from 'react-cookie';
import ReactPlayer from 'react-player'

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
    
    const fill = document.querySelector('.progress-bar-fill');
    const text = document.querySelector('.progress-text');
    const wrapper = document.querySelector('.wrapper');

    function api_call(file){
      return `http://127.0.0.1:8000/file/${cookies['interview_id']}/${file}`
    }
    function disableProgressBar(){
      console.log(progress)
      if(progress === 100){
        return true;
      }
      return false;
    }
    return (

        <>

            <div className='vis-container' >
                
                <div className="instructions-parent report-container" >
                    
                    <div className="instructions-container"  >
                        <h2 className="main-title-2 report-title" >Report:</h2>
                    </div>

                </div>


                <div className="wrapper" style={{ display: disableProgressBar() ? 'none' : 'block' }}>
                    <div className="progress-bar" >
                    <span className="progress-bar-fill"></span>  
                    </div>
                    <span className="progress-text">Download starting...</span>
                </div>


              <div className='vis-img-cont-par'>
                {results.length !== 5 ? (
                  <div className='vis-img-cont'></div>
                ) : (
                  <>
                    {results.map((obj, index) => {
                      const figures = obj.figures;
                      return (
                        <React.Fragment key={index}>
                            <h3 className='the-Q' >Question {index+1} (Video and Text extracted)</h3>
                            <div className="visu-container_Holder">
                                <div id="video-containerrrr">
                                    {/* <video className='visu-video' controls>
                                        <source src={require(`../${obj.video}`)} type="video/mp4" />
                                        <track src={require(`../${obj.vtt}`)} kind="captions" srcLang="en" label="English" />
                                    </video> */}
                                    <video className='visu-video' controls>
                                        <source src={api_call(obj.video)} type="video/mp4" />
                                        <track src={ api_call(obj.vtt)} kind="captions" srcLang="en" label="English" />
                                  </video>
                                </div>
                                {console.log(obj.highlighted_text)}
                                <p className="hamadassa" dangerouslySetInnerHTML={{ __html: obj.highlighted_text[index+1] }}></p>
                            </div>

                            <h3 className='the-Q' >Question {index+1} Results</h3>

                            <div className="feedback-Holder">
                                <h3>Feedback</h3>
                                <p>{obj.gpt_response[index+1]}</p>
                            </div>

                            <div className="feedback-Holder">
                                <h3>Complete Analysis</h3>
                                <div className="visu-container_Holder fig-Holder">
                                    {figures.map((photo) => (
                                    <img
                                        className='vis-img'
                                        src={api_call(photo)}
                                        alt='just wait'
                                        key={photo}
                                    />
                                    ))}
                                </div>
                            </div>
                            
                            
                            {index !== results.length - 1 && <hr className='visu-hr' />} {/* Add the horizontal line except for the last figure */}
                        </React.Fragment>
                        );
                    })}
                  </>
                )}
              </div>

            </div>

        
        </>

    )
}


export default Report
