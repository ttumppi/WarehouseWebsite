import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = ({ username, role }) => {


    return (
        <nav className="nav">
            <div>
                <strong>{!username ? "" : `Logged in as : ${username}`}</strong>
            </div>
            <div>
                <strong>
                    {!role ? "" : `Role : ${role}`}
                </strong>
            </div>
            <div>
                <strong>
                    {role == "admin" ? 
                    <Link to="/create-user">Create User</Link> :
                    ""}
                </strong>
            </div>
        </nav>
    )
}

export default Navigation;