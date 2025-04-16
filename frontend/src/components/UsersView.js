import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UsersView = () => {

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();
    
    const redirectToHomePage = () => {
        navigate("/");
    }





    return (
        <div>
            <div>

                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Manufacturer</th>
                            <th>Model</th>
                            <th>Serial</th>
                            <th>Balance</th>
                            <th>Location</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.location}>
                                <td>{item.manufacturer}</td>
                                <td>{item.model}</td>
                                <td>
                                <span className="clickable-shelf"
                                    onClick={() => {redirectToShelfItemPage(item.id)}}>
                                    {item.serial}
                                </span>
                                </td>
                                <td>{item.balance}</td>
                                <td>{item.location}</td>
                                <td>
                                    <button className="basic-button"
                                        onClick={() => {DeleteItem(item.location)}}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}