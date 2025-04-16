import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import StateContext from "./StateContext";

const Navigation = () => {

    const { username, role } = useContext(StateContext);

    let modifiedRole = null;
    if (role != null && role.includes("(F)")){
        modifiedRole = role.replace("(F)", "");
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
        </nav>
    )
}

export default Navigation;