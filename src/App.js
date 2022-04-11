import { BrowserRouter as Router, Routes, Route,  Link} from 'react-router-dom';
import React, { useState, useEffect }  from "react";
import Accounts from "./containers/accounts";
import Contracts from "./containers/contracts";
import History from "./containers/history";
import SignInScreen from "./containers/signinscreen";
import Navigation from "./components/navigation";
import Web3 from 'web3';



const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

function App() {
      const handleLoginSuccess = () => {

      }

      return  (
        <div className="App">
            <Router>
            {/* <Navigation /> */}
              <Routes>
                <Route path="/" element={<SignInScreen onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/accounts" element={<Accounts/>} />
                <Route path="/history" element={<History />} />
                <Route path="/contracts" element={<Contracts />} /> 
              </Routes>
            </Router>
        </div>);
}


export default App;
