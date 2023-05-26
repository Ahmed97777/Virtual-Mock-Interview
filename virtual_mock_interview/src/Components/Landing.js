import { Link } from "react-router-dom"

const Landing = () => {

    return (

        <div className="landing" >
            <div className="intro-text">
                <h1 className="websit-title" >Virtual Mock Interview</h1>
                <p>Empowering job seekers with an intelligent and unbiased interview preparation platforms that leverages advanced technology 
                    and user-driven insights to increase their chances of landing their dream job.
                </p>
                <Link to="/configuration" ><button className="button-start" >Start Interview <span className="triangle"></span></button></Link>
                
            </div>
            
        </div>

    )


}

export default Landing