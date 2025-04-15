import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, {useState, useEffect} from 'react';
import Login from './components/Login';
import ShelfsView from "./components/ShelfsView";
import CreateItem from "./components/CreateItem";
import ShelfView from "./components/ShelfView";
import AddItemView from "./components/AddItemView";
import "./App.css";

function App() {

  const [loggedIn, setLoginState] = useState(true);
  

  const setLoginSuccessfull = () => {
    setLoginState(true);
  }

  const setLoginNeeded = () => {
    setLoginState(false);
  }

  const CheckAuth = async () => {
    const shelfsRes = await fetch(
    `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelfs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
    });


    if (shelfsRes.status == 401){
      setLoginNeeded();
      return;
    }
    setLoginSuccessfull();

  }


  useEffect( () => {
    const CheckAuthWrapper = async () => {
      await CheckAuth();
    }
    CheckAuthWrapper();
    
  }, []);

  return (
    <Router>
        <Routes>

            <Route path="/" element=
              {loggedIn ? <Navigate to="/home"/> : 
              <Login loginSuccessfull={setLoginSuccessfull}/>} >
            </Route>

            <Route
              path="/home"
              element={loggedIn ? <ShelfsView loginNeeded={setLoginNeeded} /> :
              <Navigate to="/"/> }>
            </Route>

            <Route
              path="/create-item"
              element={loggedIn ? <CreateItem loginNeeded={setLoginNeeded} /> :
              <Navigate to="/"/> }>
            </Route>

            <Route
              path="/shelf/:shelf"
              element={loggedIn ? <ShelfView loginNeeded={setLoginNeeded} /> :
              <Navigate to="/"/> }>
            </Route>

            <Route
              path="/add-item/:shelf"
              element={loggedIn ? <AddItemView loginNeeded={setLoginNeeded} /> :
              <Navigate to="/"/> }>
            </Route>
            

        </Routes>
    </Router>
  );
}

export default App;
