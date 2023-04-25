import React, { useEffect } from 'react';
import { useState } from 'react'
// import { Link } from "react-router-dom"
import axios from "axios";

const Report = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

        const client = axios.create({
            baseURL: "http://127.0.0.1:5000/softwareQuestions"
        });
    
    
        const [posts, setPosts] = useState([]);
    
        useEffect(() => {
            client.get('').then((response) => {
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


            <div className="instructions-parent report-container" >
                
                <div className="instructions-container" >
                    <h2 className="main-title-2 report-title" >Report:</h2>
                </div>

                {/* <div className='link-container-for-example-page' >
                    <Link to="/interview" ><button className="button-start" >Print <span className="triangle"></span></button></Link>
                </div> */}




            </div>
        
        
        
        
        
        </>

    )

}


export default Report
