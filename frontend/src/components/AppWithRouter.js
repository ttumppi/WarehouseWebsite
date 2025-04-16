import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
  } from "react-router-dom";
  import React, {useState, useEffect} from 'react';
  import Login from './Login';
  import ShelfsView from "./ShelfsView";
  import ItemsView from "./ItemsView";
  import ShelfView from "./ShelfView";
  import AddItemView from "./AddItemView";
  import ShelfItem from "./ShelfItem";
  import Navigation from "./Navigation";
  import ChangePassword from "./ChangePassword";
  import UsersView from "./UsersView";
  import CreateUser from "./CreateUser";
  import "../App.css";


const AppWithRouter = () => {
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
        console.log("Change password");
        navigate(`/change-password/${username}`);
    }


    const setLoginNeeded = () => {
        setLoginState(false);
        setUsername(null);
        setRole(null);
    }

    const CheckAuth = async () => {
        const userRes = await fetch(
        `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
        });


        if (userRes.status == 401){
        setLoginNeeded();
        return;
        }
        const userData = await userRes.json();
        setLoginSuccessfull(userData.username, userData.role);

    }


    useEffect( () => {
        const CheckAuthWrapper = async () => {
        await CheckAuth();
        }
        CheckAuthWrapper();
        
    }, []);

    return (
        <>
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
        </>
    );
}

export default AppWithRouter;