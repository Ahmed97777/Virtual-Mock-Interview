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
            console.log(event.target.id);
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
                    <h2 className="main-title-2" >2- Please choose a field:</h2>
                </div>

            </div>

            {/* Starting the configuration process */}

            <div className="config-container">
                
                <div className="field-container" >
                    

                    <button id='Junior-Software-Engineer' onClick={handleButtonClick} className={choosenField === 'Junior-Software-Engineer' ? 'activeField' : ''}>Junior Software Engineer</button>
                    <button id='Electrical-Engineer' onClick={handleButtonClick} className={choosenField === 'Electrical-Engineer' ? 'activeField' : ''}>Electrical Engineering</button>
                    <button id='Junior-Automation-Engineer' onClick={handleButtonClick} className={choosenField === 'Junior-Automation-Engineer' ? 'activeField' : ''}>Junior Automation Engineer</button>
                    <button id='Junior-Game-Developer' onClick={handleButtonClick} className={choosenField === 'Junior-Game-Developer' ? 'activeField' : ''}>Junior Game Developer</button>
                    <button id='Junior-Frontend-Developer' onClick={handleButtonClick} className={choosenField === 'Junior-Frontend-Developer' ? 'activeField' : ''}>Junior Frontend Developer</button>
                    <button id='Junior-Mobile-Development' onClick={handleButtonClick} className={choosenField === 'Junior-Mobile-Development' ? 'activeField' : ''}>Junior Mobile Development</button>
                    <button id='Junior-Control-Engineer' onClick={handleButtonClick} className={choosenField === 'Junior-Control-Engineer' ? 'activeField' : ''}>Junior Control Engineer</button>
                    <button id='Junior-Embedded-Engineer' onClick={handleButtonClick} className={choosenField === 'Junior-Embedded-Engineer' ? 'activeField' : ''}>Junior Embedded Engineer</button>
                    <button id='Junior-Human-Resources' onClick={handleButtonClick} className={choosenField === 'Junior-Human-Resources' ? 'activeField' : ''}>Junior Human Resources</button>
                    <button id='Junior-Project-Manager' onClick={handleButtonClick} className={choosenField === 'Junior-Project-Manager' ? 'activeField' : ''}>Junior-Project-Manager</button>
                    <button id='Junior-Content-Creator' onClick={handleButtonClick} className={choosenField === 'Junior-Content-Creator' ? 'activeField' : ''}>Junior-Content-Creator</button>
                    <button id='accountant' onClick={handleButtonClick} className={choosenField === 'accountant' ? 'activeField' : ''}>accountant</button>

                    
                    
                    
                </div>

                <Link to="/example-case" ><button className="button-start" onClick={sendToBackEnd}>Next <span className="triangle"></span></button></Link>
            </div>

            {/* Ending the configuration process */}


        </>

    )

}

export default Field
