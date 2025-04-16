import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UsersView = ({ loginNeeded, username }) => {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    
    const redirectToHomePage = () => {
        navigate("/");
    }

    const redirectToCreateUserPage = () => {
        navigate("/create-user");
    }

    const GetUsers = async () => {
        try{
            const usersRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/users`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    

            if (usersRes.status == 401){
                setMessage("Not logged in");
                loginNeeded();
                return;
            }
            const usersData = await usersRes.json();

           
    
            if (!usersData.success){
                setMessage(usersData.message);
                return;
            }
            
            setMessage("");

            usersData.users.map((user) => {
                if (user.role.includes("(F)")){
                    user.role = user.role.replace("(F)", "");
                }
            })
            
           setUsers(usersData.users);
        }

        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }

    const DeleteUser = async (username) => {
        try{
            const usersRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/users/${username}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    
            const usersData = await usersRes.json();

           
    
            if (!usersData.success){
                setMessage(usersData.message);
                return;
            }

            setMessage("Successfully deleted user");

            await GetUsers();

        }
        catch(erro){
            console.log("Failed to delete user");
            setMessage("Failed to delete user");
        }
    }

    useEffect(() => {
        const wrapper = async () => {
            await GetUsers();
        }
        wrapper();
    }, []);




    return (
        <div>
            <button className="basic-button"
                onClick={redirectToHomePage}>
                Back
            </button>

            <button className="basic-button"
                onClick={redirectToCreateUserPage}>
                Create User
            </button>
            <div>

                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                {user.username != username ? <td>
                                    <button className="basic-button"
                                        onClick={() => {DeleteUser(user.username)}}>
                                        Delete
                                    </button>
                                </td>: <p>Logged in user, cannot delete</p>}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <p>{message}</p>
        </div>
    )
}