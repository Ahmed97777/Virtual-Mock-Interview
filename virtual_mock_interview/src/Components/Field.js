import React, { useEffect } from 'react';
import { Link } from "react-router-dom"

const Field = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

    return (

        <>


            <div className="logo-container-for-config" >
                <div className="top-logo-menu-for-config" >
                    <a className="logo-name-for-config" href="/" >VMI</a>
                </div>
            </div>


            <div className="instructions-parent" >
            
                <div className="instructions-container" >
                    <h2 className="main-title-2" >How to start the interview:</h2>
                    <h2 className="main-title-2" >2- Please choose field:</h2>
                </div>


            </div>



            {/* Starting the configuration process */}


            <div className="config-container">
                
                <div className="field-container" >
                    
                        <h3>Software Engineering 1</h3>
                        <h3>Field 1</h3>
                        <h3>Software Engineering 2</h3>
                        <h3>Field 1</h3>
                        <h3>Field 1</h3>
                        <h3>Field 1</h3>
                        <h3>Field 1</h3>
                        <h3>Field 1</h3>
                        <h3>Field 1</h3>
                        <h3>Software Engineering 3</h3>
                    
                    
                </div>

                <Link to="/example-case" ><button className="button-start" >Next <span className="triangle"></span></button></Link>
            </div>



            {/* Ending the configuration process */}

    
    
        </>

    )

}


export default Field
