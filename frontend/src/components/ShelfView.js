import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ShelfView = ({ loginNeeded }) => {
    const { shelf } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [message, setMessage] = useState("");
    const [size, setSize] = useState(null);
    let initialSize = useRef(null);


    const redirectToHomePage = () => {
        navigate("/home");
    }

    const redirectToItemSelectPage = () => {
        navigate(`/add-item/${shelf}`);
    }

    const redirectToShelfItemPage = (id) => {
        navigate(`/shelf/${shelf}/${id}`);
    }


    const GetShelfSize = async (shelfName) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelfName}/size`, {
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
                setSize(null)
                setMessage(shelfData.message);
                return;
            }
            
            setMessage("");
            
           
            initialSize.current =  shelfData.size;
            setSize(shelfData.size);
        }

        catch(error){
            setMessage("Failed to fetch size");
            console.log(`Failed to fetch size: ${error}`);
        }
    }

    const ChangeSize = async () => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/size`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    size: size
                })
                });

            if (shelfRes.status == 401){
                setMessage("Not logged in");
                loginNeeded();
                return;
            }
    
            const shelfData = await shelfRes.json();

           
    
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
            
            setMessage("Changed size");
            initialSize.current = size;
            
           
        }

        catch(error){
            setMessage("Failed to change size");
            console.log(`Failed to change size: ${error}`);
        }
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
            await GetShelfSize(shelf);
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
                <h3>Shelf size</h3>
                <input
                    type="number"
                    min="0"
                    value={(size == null) ? 0 : size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    />

            <br/>

            <button className="basic-button"
                disabled={initialSize.current == size}
                onClick={ChangeSize}>
                    Change Size
                </button>
            <br/>
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

            <div>
                {message && <p>{message}</p>}
            </div>
        </div>
    )


}

export default ShelfView;