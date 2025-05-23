import React, { useState, useContext } from "react";
import { GenerateRandomString } from "../stringFunctions";
import CryptoJS from "crypto-js";
import StateContext from "./StateContext";
const CreateUser = () => {

    const { setLoginNeeded, roles } = useContext(StateContext);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [role, setRole] = useState(roles[0]);
    const [message, setMessage] = useState("");

    const CreateUserSubmit = async (e) => {
        e.preventDefault();
        
        try {
              
            
        
            const salt = GenerateRandomString(8);
            const combined = password + salt;
            const hash = CryptoJS.SHA256(combined).toString();

            const editedRole = "(F)" + role;
              
            const loginRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password: hash,
                    role: editedRole, salt
                 }),
              });

            if (loginRes.status == 401){
                setMessage("Not logged in");
                setLoginNeeded();
                return;
            }
        
            const loginData = await loginRes.json();
        
              
        
            if (!loginData.success) {
                setMessage("Failed to create user");
                return;
            }

            
        
            setMessage("Successfully created user");
            setRole(roles[0]);
            setUsername("");
            setPassword("");
        
        
            
        
        
        } 
        catch (err) {
            console.error(`Failed  to create user : ${err}`);
            setMessage("Failed to create user");
        }
    }



    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={CreateUserSubmit}>

                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required

                /><br/>

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required

                /><br/>

                <select
                    value={ role}
                    onChange={(e) => setRole(e.target.value)}>
                    
                    {roles.map((role) => (
                        <option key={role}>{role}</option>
                    ))}
                </select>

                <button type="submit">Create</button>
            </form>
            <p>{message}</p>
        </div>
    )


}


export default CreateUser;