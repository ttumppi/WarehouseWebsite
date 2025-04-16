import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import StateContext from "./StateContext";


const Navigation = () => {


    const navigate = useNavigate();
    const { username, role } = useContext(StateContext);

    let modifiedRole = null;
    if (role != null && role.includes("(F)")){
        modifiedRole = role.replace("(F)", "");
    }

    const redirectToHomePage = () => {
        navigate("/");
    }

    const Logout = async () => {
        await fetch(`http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/logout`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });

        redirectToHomePage();
    }

    return (
        <nav className="nav">
            <div>
                <strong>{!username ? "" : `Logged in as : ${username}`}</strong>
            </div>
            <div>
                <strong>
                    {!role ? "" : `Role : ${modifiedRole?? role}`}
                </strong>
            </div>
            <div>
                <strong>
                    {role == "Admin" ? 
                    <Link to="/users">User Management</Link> :
                    ""}
                </strong>
            </div>
            <span className="clickable-shelf" onClick={Logout}>
                {!username ? "" : "Logout"}
            </span>
        </nav>
    )
}

export default Navigation;