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

    console.log(results);
    

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
        
    // const options = {
    //         responseType: 'blob',
    //         onDownloadProgress: function(progressEvent) {
    //             const percentComplete = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
    //             fill.style.width = percentComplete + '%';
    //             text.textContent = percentComplete + '%';
    //         }
    //         };
        
    // axios.get('https://picsum.photos/400/400', options)
    //         .then(res => {
    //             // Do something with the result here
    //             console.log("one",res);
    //             const img = new Image();    
    //             img.src = URL.createObjectURL(res.data);
    //             console.log('two',img);
    //             console.log("three",img.src);
    //             img.onload = () => {
    //                 setSaveImage(img.src);
    //                 setIsLoading(false);
    //                 wrapper.remove();
    //                 console.log(backendOutput);
    //             };

                
    //         })
    //         .catch(err => console.log(err));


    // const [backendOutput, setBackendOutput] = useState([
    //         {
    //             "status": "success",
    //             "highlighted_text": {
    //                 "1": "Okay.\nOkay.\nOkay.\nI was saying your name and profession background.\nHello.\nI'm Ahmed.\nCurrently, I'm in my last year, a college.\nI studied computer engineering and software systems, and the quality of engineering and the\nscience shops.\nMy specialization is software mainly.\nI have learned multiple courses about software during the college.\nAnd also, I have, I've learned in certain courses that supports like starting a good\ncareer in the backend, like design patterns, data pays management.\nThen from there, I started learning Python, and I went to a Python to learn Flask, so that\nI can start my back and carry me using Flask.\nIn Flask, I learned more about Flask APIs, how requests work, and how the SQL LKME handles\ndatabases.\nAnd I went from there to sort of implementing products.\nMy recent project is our, like, the most recent project that I'm currently working in,\nis I'm currently working on, is my relation project.\nIt's fully, like, it's back and it's fully developed by me, and it's developed in Flask\nPython, and I'm looking forward to get, like, I'm looking forward to get insights\nfrom your company about Flask and how does it operate and work environment.\n"
    //             },
    //             "text": {
    //                 "1": "Okay.\nOkay.\nOkay.\nI was saying your name and profession background.\nHello.\nI'm Ahmed.\nCurrently, I'm in my last year, a college.\nI studied computer engineering and software systems, and the quality of engineering and the\nscience shops.\nMy specialization is software mainly.\nI have learned multiple courses about software during the college.\nAnd also, I have, I've learned in certain courses that supports like starting a good\ncareer in the backend, like design patterns, data pays management.\nThen from there, I started learning Python, and I went to a Python to learn Flask, so that\nI can start my back and carry me using Flask.\nIn Flask, I learned more about Flask APIs, how requests work, and how the SQL LKME handles\ndatabases.\nAnd I went from there to sort of implementing products.\nMy recent project is our, like, the most recent project that I'm currently working in,\nis I'm currently working on, is my relation project.\nIt's fully, like, it's back and it's fully developed by me, and it's developed in Flask\nPython, and I'm looking forward to get, like, I'm looking forward to get insights\nfrom your company about Flask and how does it operate and work environment.\n"
    //             },
    //             "figures": [
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/1_video_0.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/1_video_1.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/1_video_2.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/1_video_3.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/1_video_4.png"
    //             ],
    //             "video": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_1_video.mp4",
    //             "vtt": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_1_video.vtt"
    //         },
    //         {
    //             "status": "success",
    //             "highlighted_text": {
    //                 "2": "How do you stay up there and that's redrains in the bottom and it's related to feed?\nWell, the thing is, I usually tend to see, I usually tend to see the latest news from,\nI think, from LinkedIn because I think it's okay.\nSo I see, LinkedIn mainly for, like, the major trends that happens in the development.\nAnd for, from LinkedIn, I tend to, if I like, I really, I saw a company,\nor like, a big company, a company that developed a very good product.\nI start to see who works there and then I tend to follow them and make it into\nto see their own, like, their own products and I try to study their products,\ntheir own products, like, so that, like, maybe one day I get to reach to what they have reached\nand how they work in that company now. Also, not only LinkedIn, I seek to get more knowledge\nabout the currently, the new trends. There's Twitter, actually, which is a very good and uncommon\nresource for getting trends about development because I think many of Twitter is individual-based,\nso you can get trends from, you can get insights from people who actually develop the things\nof, like, someone who developed this sport, if you're very interested about a certain\npart in a fully product, you can see who developed this sport and then <span style=\"color: red; text-decoration: underline;\">you see</span> his insights\nfrom, like, Twitter, if he is writing a blog about it. Yeah, I think like that.\n"
    //             },
    //             "text": {
    //                 "2": "How do you stay up there and that's redrains in the bottom and it's related to feed?\nWell, the thing is, I usually tend to see, I usually tend to see the latest news from,\nI think, from LinkedIn because I think it's okay.\nSo I see, LinkedIn mainly for, like, the major trends that happens in the development.\nAnd for, from LinkedIn, I tend to, if I like, I really, I saw a company,\nor like, a big company, a company that developed a very good product.\nI start to see who works there and then I tend to follow them and make it into\nto see their own, like, their own products and I try to study their products,\ntheir own products, like, so that, like, maybe one day I get to reach to what they have reached\nand how they work in that company now. Also, not only LinkedIn, I seek to get more knowledge\nabout the currently, the new trends. There's Twitter, actually, which is a very good and uncommon\nresource for getting trends about development because I think many of Twitter is individual-based,\nso you can get trends from, you can get insights from people who actually develop the things\nof, like, someone who developed this sport, if you're very interested about a certain\npart in a fully product, you can see who developed this sport and then you see his insights\nfrom, like, Twitter, if he is writing a blog about it. Yeah, I think like that.\n"
    //             },
    //             "figures": [
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/2_video_0.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/2_video_1.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/2_video_2.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/2_video_3.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/2_video_4.png"
    //             ],
    //             "video": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_2_video.mp4",
    //             "vtt": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_2_video.vtt"
    //         }
    //         ,
    //         {
    //             "status": "success",
    //             "highlighted_text": {
    //                 "3": "Okay, well programming language and frameworks are you most comfortable working with?\nWell, I actually, I started learning programming with C++ that was in college.\nWe got C++ made me to just try to know how to write codes, what are the attributes, etc.\nSo it was a very good beginner language for me so that I can understand how does memory work, etc.\nWe went from C++ to learning C.\nWe learned C, so that like from C people started to go to two different routes, one for like the very\nlevel languages is like assembly and etc.\nAnd disabled like focus mainly on the computer engineering part of our like college specialization.\nAnd other people like me who went to the high level languages like Python and Java, etc.\nSo currently my most programming language that I'm very comfortable with is Python actually because like maybe my last five or ten projects was developed in Python actually and it is very\nI'm very flexible with Python, I think I can.\nI really like Python because like I can just develop anything with this mainly actually.\nYeah.\n"
    //             },
    //             "text": {
    //                 "3": "Okay, well programming language and frameworks are you most comfortable working with?\nWell, I actually, I started learning programming with C++ that was in college.\nWe got C++ made me to just try to know how to write codes, what are the attributes, etc.\nSo it was a very good beginner language for me so that I can understand how does memory work, etc.\nWe went from C++ to learning C.\nWe learned C, so that like from C people started to go to two different routes, one for like the very\nlevel languages is like assembly and etc.\nAnd disabled like focus mainly on the computer engineering part of our like college specialization.\nAnd other people like me who went to the high level languages like Python and Java, etc.\nSo currently my most programming language that I'm very comfortable with is Python actually because like maybe my last five or ten projects was developed in Python actually and it is very\nI'm very flexible with Python, I think I can.\nI really like Python because like I can just develop anything with this mainly actually.\nYeah.\n"
    //             },
    //             "figures": [
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/3_video_0.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/3_video_1.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/3_video_2.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/3_video_3.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/3_video_4.png"
    //             ],
    //             "video": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_3_video.mp4",
    //             "vtt": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_3_video.vtt"
    //         },
    //         {
    //             "status": "success",
    //             "highlighted_text": {
    //                 "4": "describe time when you encounter an expected problem or change while you're taking a project,\nhow do you solve that?\nWell, recently we were working on our gradation project and we had this very uncommon problem\nthat we never faced before.\nThe problem was in the problem wasn't the configuration of our project, mainly the problem\nwas that we were using pre-trained models and APIs for our these pre-trained models.\nUsually they take complex data then process it and get us the result.\nAlthough they are pre-trained but they are still GPU intensive to analyze these data\nbecause the data itself are complex like they are frames of images and frames of audio.\nSo we couldn't really manage to like run them in parallel, although like they are very like the hierarchy of our code\nmake them very like parallelizable.\nHowever, we couldn't run them on parallel because they were both of them were like GPU intensive\nand they take a lot of GPU VRMs.\nSo, to solve this problem we implemented a queue system in which each model can only run once at a time.\nAnd once the other models cannot start unless this model process finishes and frees GPU.\nSo, we didn't have to host like another GPU and cost us more money.\nHowever, like the time delay to like between these two processes like parallel and serialization was not updated.\n"
    //             },
    //             "text": {
    //                 "4": "describe time when you encounter an expected problem or change while you're taking a project,\nhow do you solve that?\nWell, recently we were working on our gradation project and we had this very uncommon problem\nthat we never faced before.\nThe problem was in the problem wasn't the configuration of our project, mainly the problem\nwas that we were using pre-trained models and APIs for our these pre-trained models.\nUsually they take complex data then process it and get us the result.\nAlthough they are pre-trained but they are still GPU intensive to analyze these data\nbecause the data itself are complex like they are frames of images and frames of audio.\nSo we couldn't really manage to like run them in parallel, although like they are very like the hierarchy of our code\nmake them very like parallelizable.\nHowever, we couldn't run them on parallel because they were both of them were like GPU intensive\nand they take a lot of GPU VRMs.\nSo, to solve this problem we implemented a queue system in which each model can only run once at a time.\nAnd once the other models cannot start unless this model process finishes and frees GPU.\nSo, we didn't have to host like another GPU and cost us more money.\nHowever, like the time delay to like between these two processes like parallel and serialization was not updated.\n"
    //             },
    //             "figures": [
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/4_video_0.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/4_video_1.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/4_video_2.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/4_video_3.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/4_video_4.png"
    //             ],
    //             "video": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_4_video.mp4",
    //             "vtt": "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/92d77e68-ad3f-4edf-aaed-750b53a0f0cf_4_video.vtt"
    //         },
    //         {
    //             "status": "success",
    //             "highlighted_text": {
    //                 "5": "How do you stay on the tail of the latest industry trends and advancements software development?\nWell, I think mainly I focus on LinkedIn because I get to see the information from the companies\nitself and people tend to help the very good advancement and trends unlike it and so\nso whatever new topic or new industry it gets very trendy was in a very few time so I think\nI'm really active on LinkedIn and I get to get the latest information from there. Also,\nif I really like a certain part of a product I'm really keen on knowing how the sport works\nor behave and I get to know who from this company developed this part exactly I might start to\nlike see his GitHub and go on from there to go on from like his GitHub to see his personal\nprojects and how he usually I'm sorry can I give you a second\nWell, I'm sorry for this encounter I hope it doesn't happen again so yeah mainly it is\nLinkedIn and get help for like if I really like a certain part of a topic and I want to see\nlike how it is developed from this person. Yes, and I hope I get accepted in your interview\nand thank you very much.\n"
    //             },
    //             "text": {
    //                 "5": "How do you stay on the tail of the latest industry trends and advancements software development?\nWell, I think mainly I focus on LinkedIn because I get to see the information from the companies\nitself and people tend to help the very good advancement and trends unlike it and so\nso whatever new topic or new industry it gets very trendy was in a very few time so I think\nI'm really active on LinkedIn and I get to get the latest information from there. Also,\nif I really like a certain part of a product I'm really keen on knowing how the sport works\nor behave and I get to know who from this company developed this part exactly I might start to\nlike see his GitHub and go on from there to go on from like his GitHub to see his personal\nprojects and how he usually I'm sorry can I give you a second\nWell, I'm sorry for this encounter I hope it doesn't happen again so yeah mainly it is\nLinkedIn and get help for like if I really like a certain part of a topic and I want to see\nlike how it is developed from this person. Yes, and I hope I get accepted in your interview\nand thank you very much.\n"
    //             },
    //             "figures": [
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/5_video_0.png",
    //                 "uploads/92d77e68-ad3f-4edf-aaed-750b53a0f0cf/5_video_1.png",
    //                 "uploads/92d7import
        //     player.dispose();
        //     };
        // }, []);



    return (

        <>

            <div className='vis-container' >
                
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


              <div className='vis-img-cont-par'>
                {results.length !== 5 ? (
                  <div className='vis-img-cont'></div>
                ) : (
                  <>
                    {results.map((obj, index) => {
                      console.log(obj.video)
                      console.log(obj.vtt);
                      
                      const figures = obj.figures;
                      return (
                        <React.Fragment key={index}>
                          <div id="video-container">
                            <video className='visu-video' controls>
                              <source src={require(`../${obj.video}`)} type="video/mp4" />
                              <track label="English" kind="subtitles" srcLang="en" src={`../${obj.vtt}`}/>
                              {/* Your browser does not support the video tag. */}
                            </video>
                          </div>
                          {figures.map((photo, photoIndex) => (
                            
                            <img
                              className='vis-img'
                              src={require(`../${photo}`)}
                              alt='just wait'
                              key={photoIndex}
                            />
                          ))}
                          {index !== results.length - 1 && <hr className='visu-hr' />}
                          {/* Add the horizontal line except for the last figure */}
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
