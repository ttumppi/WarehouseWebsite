import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetShelf } from "../../../backend/src/db/dbHandler";

const ShelfView = ({ loginNeeded }) => {
    const { shelf } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [message, setMessage] = useState("");


    const redirectToHomePage = () => {
        navigate("/home");
    }



    const GetShelfItems = async (shelfName) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelfName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    
            const shelfData = await shelfRes.json();

           
    
            if (!shelfData.success){
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
                    Create item
                </button>

            </div>

            <div>
                <ul>
                    
                    {items.map((item) => {
                        <li>
                            {item.manufacturer}
                            {item.model}
                            {item.serial}
                            {item.balance}
                        </li>
                    })}
                    
                </ul>
            </div>

            <div>
                {message && <p>{message}</p>}
            </div>
        </div>
    )


}

export default ShelfView;