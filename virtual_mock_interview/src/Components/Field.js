import React, { useEffect } from 'react';
import { Link } from "react-router-dom"

const Field = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);



        const handleButtonClick = (e) => {
            console.log(e.target.id);
        };





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
                    


                        <button id='soft-en' onClick={handleButtonClick}>Software Engineering</button>
                        <button id='elec-en' onClick={handleButtonClick}>Electrical Engineering</button>
                        <button id='mecha-en' onClick={handleButtonClick}>Mechanical Engineering</button>
                        <button id='auto-en' onClick={handleButtonClick}>Automation Engineering</button>
                        <button id='code-g' onClick={handleButtonClick}>Coding General</button>
                        <button id='jun-web' onClick={handleButtonClick}>Junior Web Development</button>
                        <button id='sen-web' onClick={handleButtonClick}>Senior Web Development</button>
                        <button id='frs-web' onClick={handleButtonClick}>Fresh Web Development</button>
                        <button id='frs-mob' onClick={handleButtonClick}>Fresh Mobile Development</button>
                        <button id='sen-mob' onClick={handleButtonClick}>Senior Mobile Development</button>
                        <button id='jun-mob' onClick={handleButtonClick}>Junior Mobile Development</button>
                        <button id='game-dev' onClick={handleButtonClick}>Game Development</button>
                        
                    
                </div>

                <Link to="/example-case" ><button className="button-start" >Next <span className="triangle"></span></button></Link>
            </div>



            {/* Ending the configuration process */}

    
    
        </>

    )

}


export default Field
