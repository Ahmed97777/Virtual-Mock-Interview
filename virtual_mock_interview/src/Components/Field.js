import React, { useEffect } from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Field = () => {
    const [cookies, setCookie] = useCookies(['job-field']);
    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);

    const [choosenField, setChoosenField] = useState('');

    const handleButtonClick = (event) => {
        setChoosenField(event.target.id);
        console.log(event.target.id);
        };

    const navigate = useNavigate();    
    
    const handleFieldSelect = () => {
        setCookie('job-field', choosenField, { path: '/' });

        if (choosenField === '') {
            const alertBox = document.createElement('div');
            alertBox.classList.add('custom-alert');
            alertBox.textContent = 'Please choose a field first';
            document.body.appendChild(alertBox);

            setTimeout(() => {
            alertBox.remove();
            }, 2000);
        }
        else {
            navigate('/example-case');
        }

        }
    return (

        <>

            <div className='FCPP' >


                <div className="instructions-parent" >
                
                    <div className="instructions-container" >
                        <h2 className="main-title-2" >How to start the interview:</h2>
                        <h2 className="main-title-2" >2- Please choose the field you want to make an interview in:</h2>
                    </div>

                </div>

                {/* Starting the configuration process */}

                <div className="config-container FCP">
                    
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

                    <button className="button-start" onClick={handleFieldSelect}>Next see an example <span className="triangle"></span></button>
                </div>

                {/* Ending the configuration process */}
            </div>

            


        </>

    )

}

export default Field
