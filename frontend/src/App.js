import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, {useState} from 'react';
import Login from './components/Login';
import ShelfView from "./components/ShelfView";

function App() {

  const [loggedIn, setLoginState] = useState()
  setLoginState(true);

  const setLoginSuccessfull = () => {
    setLoginState(true);
  }

  const setLoginNeeded = () => {
    setLoginState(false);
  }


  return (
    <Router>
        <Routes>

            <Route path="/" element=
              {loggedIn ? <Navigate to="/home"/> : 
              <Login loginSuccessfull={setLoginSuccessfull}/>} >
            </Route>

            <Route
              path="/home"
              element={<ShelfView loginNeeded={setLoginNeeded}/> }>
            </Route>
            
        </Routes>
    </Router>
  );
}

export default App;
