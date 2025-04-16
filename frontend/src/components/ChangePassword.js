import React, { useState, useContext } from "react";
import CryptoJS from "crypto-js";
import { GenerateRandomString } from "../stringFunctions";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import StateContext from "./StateContext";

const ChangePassword = () => {

    const { setLoginNeeded, username } = useContext(StateContext);

    const {URLusername} = useParams();
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const redirectToHomePage = () => {
        navigate("/");
    }

    const ChangePasswordSubmit = async (e) => {
        e.preventDefault();
        
            try {

                const saltRes = await fetch(
                    `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/login/${URLusername}`);
                    

                if (saltRes.status == 401){
                    setMessage("Not logged in");
                    setLoginNeeded();
                    return;
                }
                const saltData = await saltRes.json();
            
                if (!saltData.success) {
                setMessage(saltData.message);
                return;
                }
            
                const salt = saltData.salt;

                const oldCombined = oldPassword + salt;
                const oldHash = CryptoJS.SHA256(oldCombined).toString();

                const oldLoginRes = await fetch(
                    `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ URLusername, password: oldHash }),
                  });
            
                  const oldLoginData = await oldLoginRes.json();
            
                  
            
                  if (!oldLoginData.success) {
                    setMessage("Old password does not match");
                    return;
                  }

                if (rePassword != password){
                    setMessage("New password does not match retyped password")
                    return;
                }
             
                const newSalt = GenerateRandomString(8);   
                const combined = password + newSalt;
                const hash = CryptoJS.SHA256(combined).toString();

                const changeRes = await fetch(
                    `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/change-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ URLusername, password: hash, salt: newSalt }),
                });
            
                const changeData = await changeRes.json();
            
                
            
                if (changeData.success) {
            
                    setMessage("Password Change success");

                    const loginResult = await fetch(`http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ URLusername, password: hash }),
                        });

                    redirectToHomePage();
                    return;
                }
                else{
                    setMessage("Failed to change password");
                }    
            
                
            
            
            }
            catch (err) {
            console.error(err);
            setMessage("Error during password change");
            }
    }

    useEffect(() => {
        if (URLusername != username){
            redirectToHomePage();
        }
    })

    return (
        <div>
            <h2>Change password :</h2>

            <form onSubmit={ChangePasswordSubmit}>
            <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required>
                </input>

                <br/>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required>
                </input>    

                <br/>

                <input
                    type="password"
                    placeholder="Retyped New Password"
                    value={rePassword}
                    onChange={e => setRePassword(e.target.value)}
                    required>
                </input>

                <br/>

                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default ChangePassword;