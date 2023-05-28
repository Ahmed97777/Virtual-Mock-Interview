import React from 'react';
import { useEffect } from 'react';
import axios from "axios";

const Report = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

        // const client = axios.create({
        //     baseURL: "http://127.0.0.1:5000/softwareQuestions"
        // });
    
    
        // const [posts, setPosts] = useState([]);
    
        // useEffect(() => {
        //     client.get('').then((response) => {
        //         setPosts(response.data);
        //     });
        //     }, []);


    //     const instructionsRef = useRef(null);

        useEffect(() => {
        const fill = document.querySelector('.progress-bar-fill');
        const text = document.querySelector('.progress-text');
        const wrapper = document.querySelector('.wrapper');
    
        const options = {
        responseType: 'blob',
        onDownloadProgress: function(progressEvent) {
            const percentComplete = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            fill.style.width = percentComplete + '%';
            text.textContent = percentComplete + '%';
        }
        };
    
        axios.get('https://picsum.photos/400/400', options)
        .then(res => {
            // Do something with the result here
            console.log(res);
            const img = new Image();
            img.src = URL.createObjectURL(res.data);
        })
        .catch(err => console.log(err));
    }, []);




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
