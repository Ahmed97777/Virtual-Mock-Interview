import React, { useEffect } from 'react';
import { Link } from "react-router-dom"

const Interview = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

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
                        <div className="question">Why do you want this position?</div>
                        <div className='ex-start-holder' ><button className="ex-start" >Start Answer </button></div>
                        <div className='ex-next-holder' ><button className="ex-next" >Next question </button></div>
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
