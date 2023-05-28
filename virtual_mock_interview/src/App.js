import "./App.css";
import Header from "./Components/Header";
import Landing from "./Components/Landing";
import HomeMain from "./Components/HomeMain";
import Footer from "./Components/Footer";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NotFound from "./Components/NotFound";
import Config from "./Components/Config";
import Field from "./Components/Field";
import ExampleCase from "./Components/ExampleCase";
import Interview from "./Components/Interview";
import Report from "./Components/Report";


function App() {
  return (
    <div className="App">

      {/* A Header that will always be there */}
      <Header/>
      
      <div className="the-main" >  

        {/* The differences will be here */}
      <BrowserRouter>
        <Routes>

          <Route  path="/" element= {<div><Landing/><HomeMain/></div>} />
          <Route  path="/configuration" element= {<Config/>} />
          <Route  path="/field" element= {<Field/>} />
          <Route  path="/example-case" element= {<ExampleCase/>} />
          <Route  path="/interview" element= {<Interview/>} />
          <Route  path="/report" element= {<Report/>} />
          {/* just for test */}
          {/* <Route  path="/report" element= {<VideoApi/>} /> */} 
          <Route  path="*" element= {<div><NotFound/></div>} />

        </Routes>
      </BrowserRouter>


      </div>
      
      

      {/* A Footer that will always be there */}
      <Footer/>

    </div>
  );
}

export default App;
