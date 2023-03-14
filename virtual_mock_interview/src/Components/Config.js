import { Link } from "react-router-dom"

const Config = () => {

    return (


        <>


            <div className="logo-container-for-config" id="page-top" >
                <div className="top-logo-menu-for-config" >
                    <a className="logo-name-for-config" href="#page-top" >VMI</a>
                </div>
            </div>


            <div className="instructions-parent" >
            
                <div className="instructions-container" >
                    <h2 className="main-title-2" >How to start the interview:</h2>
                    <h2 className="main-title-2" >1- Please allow access for camera permission, mic permission:</h2>
                </div>


            </div>



            {/* Starting the configuration process */}


            <div className="config-container">
                <div className="config-box">
                    <img src="/video-logo-removebg-preview.png" alt="Video Logo" className="config-img" ></img>
                    <p>No Video URL</p>
                </div>
                <div className="config-box">
                    <img src="/audio-logo-removebg-preview.png" alt="Mic Logo" className="config-img" ></img>
                    <p>No Audio URL</p>
                </div>
                <Link to="/field" ><button className="button-start" >Next <span className="triangle"></span></button></Link>
            </div>



            {/* Ending the configuration process */}


        
        
        </>

        

    )

}

export default Config
