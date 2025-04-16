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
  import StateContext from "./StateContext";


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
        <StateContext.Provider value={{
            setLoginSuccessfull,
            passwordChangeNeeded,
            username,
            role,
            roles
        }}>
            <Navigation username={username} role={role}></Navigation>
            <Routes>
                
                <Route path="/" element=
                {loggedIn ? <Navigate to="/home"/> : 
                <Login />} >
                </Route>

                <Route
                path="/home"
                element={loggedIn ? <ShelfsView  /> :
                <Navigate to="/"/> }>
                </Route>

                <Route
                path="/items"
                element={loggedIn ? <ItemsView /> :
                <Navigate to="/"/> }>
                </Route>

                <Route
                path="/shelf/:shelf"
                element={loggedIn ? <ShelfView /> :
                <Navigate to="/"/> }>
                </Route>

                <Route
                path="/add-item/:shelf"
                element={loggedIn ? <AddItemView /> :
                <Navigate to="/"/> }>
                </Route>

                <Route
                path="/shelf/:shelf/:id"
                element={loggedIn ? <ShelfItem /> :
                <Navigate to="/"/> }>
                </Route>

                <Route
                path="/change-password/:username"
                element={loggedIn ? <ChangePassword  /> :
                <Navigate to="/"/> }>
                </Route>

                <Route
                path="/create-user"
                element={loggedIn ? <CreateUser  /> :
                <Navigate to="/"/> }>
                </Route>

                <Route
                path="/users"
                element={loggedIn ? <UsersView  /> :
                <Navigate to="/"/> }>
                </Route>
                

            </Routes>
        </StateContext.Provider>
    );
}

export default AppWithRouter;