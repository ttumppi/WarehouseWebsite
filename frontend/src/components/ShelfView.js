import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShelfView = ({ loginNeeded }) => {
    const { shelf } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [message, setMessage] = useState("");


    const redirectToHomePage = () => {
        navigate("/home");
    }

    const redirectToItemSelectPage = () => {
        navigate(`/add-item/${shelf}`)
    }



    const GetShelfItems = async (shelfName) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelfName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });

            if (shelfRes.status == 401){
                setMessage("Not logged in");
                loginNeeded();
                return;
            }
    
            const shelfData = await shelfRes.json();

           
    
            if (!shelfData.success){
                setItems([]);
                setMessage(shelfData.message);
                return;
            }
            
            setMessage("");
            
           
            setItems(shelfData.items);
        }

        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }

    const DeleteItem = async (location) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({location: location})
                });

            const shelfData = await shelfRes.json();

            if (!shelfData.success){
                setMessage("Failed to delete item");
                return;
            }

            await GetShelfItems(shelf);
        }
        catch(error){
            setMessage("Failed to delete item");
            console.log(`Failed to delete item : ${error}`);
        }
        
    }

    useEffect(() => {

        const getShelfItemsWrapper = async () => {
            await GetShelfItems(shelf);
        }

        getShelfItemsWrapper();
    }, []);


    return (
        <div>
            <div className="shelf-header">
                <h2>shelf {shelf}</h2>

                <button className="header-button" 
                onClick={ redirectToHomePage}>
                    Back
                </button>

                <button className="basic-button" 
                onClick={redirectToItemSelectPage}>
                    Add Item
                </button>

            </div>

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
                                <td>{item.serial}</td>
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

            <div>
                {message && <p>{message}</p>}
            </div>
        </div>
    )


}

export default ShelfView;