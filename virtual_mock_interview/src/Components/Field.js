import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom"
import axios from "axios";

const Field = () => {
    const client = axios.create({
        baseURL: "http://127.0.0.1:5000"
     });
     
    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

        const [choosenField, setChoosenField] = useState('');

        const handleButtonClick = (event) => {
            setChoosenField(event.target.id);
        };

        const sendToBackEnd = () => {
            const endpoint = "/questions";
            client.get(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                params:{
                    job_field: choosenField
                },
                data:{}
            })
            .then(response => {
            console.log('Success:', response);
            // Handle success response here, such as displaying a success message to the user
            })
            .catch(error => {
            console.error('Error:', error);
            // Handle error response here, such as displaying an error message to the user
            });
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
                    

                    <button id='soft-en' onClick={handleButtonClick} className={choosenField === 'soft-en' ? 'activeField' : ''}>Software Engineering</button>
                    <button id='elec-en' onClick={handleButtonClick} className={choosenField === 'elec-en' ? 'activeField' : ''}>Electrical Engineering</button>
                    <button id='mecha-en' onClick={handleButtonClick} className={choosenField === 'mecha-en' ? 'activeField' : ''}>Mechanical Engineering</button>
                    <button id='auto-en' onClick={handleButtonClick} className={choosenField === 'auto-en' ? 'activeField' : ''}>Automation Engineering</button>
                    <button id='code-g' onClick={handleButtonClick} className={choosenField === 'code-g' ? 'activeField' : ''}>Coding General</button>
                    <button id='jun-web' onClick={handleButtonClick} className={choosenField === 'jun-web' ? 'activeField' : ''}>Junior Web Development</button>
                    <button id='sen-web' onClick={handleButtonClick} className={choosenField === 'sen-web' ? 'activeField' : ''}>Senior Web Development</button>
                    <button id='frs-web' onClick={handleButtonClick} className={choosenField === 'frs-web' ? 'activeField' : ''}>Fresh Web Development</button>
                    <button id='frs-mob' onClick={handleButtonClick} className={choosenField === 'frs-mob' ? 'activeField' : ''}>Fresh Mobile Development</button>
                    <button id='sen-mob' onClick={handleButtonClick} className={choosenField === 'sen-mob' ? 'activeField' : ''}>Senior Mobile Development</button>
                    <button id='jun-mob' onClick={handleButtonClick} className={choosenField === 'jun-mob' ? 'activeField' : ''}>Junior Mobile Development</button>
                    <button id='game-dev' onClick={handleButtonClick} className={choosenField === 'game-dev' ? 'activeField' : ''}>Game Development</button>
                    
                    
                </div>

                <Link to="/example-case" ><button className="button-start" onClick={sendToBackEnd}>Next <span className="triangle"></span></button></Link>
            </div>

            {/* Ending the configuration process */}


        </>

    )

}

export default Field
