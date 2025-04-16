import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import React, {useState, useEffect} from 'react';
import Login from './components/Login';
import ShelfsView from "./components/ShelfsView";
import ItemsView from "./components/ItemsView";
import ShelfView from "./components/ShelfView";
import AddItemView from "./components/AddItemView";
import ShelfItem from "./components/ShelfItem";
import Navigation from "./components/Navigation";
import ChangePassword from "./components/ChangePassword";
import UsersView from "./components/UsersView";
import CreateUser from "./components/CreateUser";
import "./App.css";

function App() {

  const [loggedIn, setLoginState] = useState(true);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  const roles = ["Observer", "Warehouse worker", "Admin"];
  
  const navigate = useNavigate();

  const setLoginSuccessfull = (username, role) => {
    setLoginState(true);
    setUsername(username);
    setRole(role);
  }

  const passwordChangeNeeded = (username) => {
    navigate(`/change-password/${username}`);
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

        <Navigation username={username} role={role}></Navigation>
        <Routes>

            <Route path="/" element=
              {loggedIn ? <Navigate to="/home"/> : 
              <Login loginSuccessfull={setLoginSuccessfull} 
              changePassword={passwordChangeNeeded}/>} >
            </Route>

            <Route
              path="/home"
              element={loggedIn ? <ShelfsView loginNeeded={setLoginNeeded} /> :
              <Navigate to="/"/> }>
            </Route>

            <Route
              path="/items"
              element={loggedIn ? <ItemsView loginNeeded={setLoginNeeded} /> :
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

            <Route
              path="/shelf/:shelf/:id"
              element={loggedIn ? <ShelfItem loginNeeded={setLoginNeeded} /> :
              <Navigate to="/"/> }>
            </Route>

            <Route
              path="/change-password/:username"
              element={loggedIn ? <ChangePassword loginNeeded={setLoginNeeded} /> :
              <Navigate to="/"/> }>
            </Route>

            <Route
              path="/create-user"
              element={loggedIn ? <CreateUser loginNeeded={setLoginNeeded}
              roles={roles} /> :
              <Navigate to="/"/> }>
            </Route>

            <Route
              path="/users"
              element={loggedIn ? <UsersView loginNeeded={setLoginNeeded}
              username={username} /> :
              <Navigate to="/"/> }>
            </Route>
            

        </Routes>
    </Router>
  );
}

export default App;
