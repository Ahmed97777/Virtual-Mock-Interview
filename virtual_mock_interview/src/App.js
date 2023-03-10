import "./App.css";
import Header from "./Components/Header";
import Landing from "./Components/Landing";
import HomeMain from "./Components/HomeMain";
import Footer from "./Components/Footer";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NotFound from "./Components/NotFound";
import Config from "./Components/Config";

function App() {
  return (
    <div className="App">
      
      {/* A Header that will always be there */}
      <Header/>

      {/* The differences will be here */}
      <BrowserRouter>
        <Routes>

          <Route  path="/" element= {<div><Landing/><HomeMain/></div>} />
          <Route  path="/configuration" element= {<Config/>} />
          <Route  path="*" element= {<NotFound/>} />

        </Routes>
      </BrowserRouter>

      {/* A Footer that will always be there */}
      <Footer/>

    </div>
  );
}

export default App;
