import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Items = ({ loginNeeded }) => {
    const [manufacturer, setManufacturer] = useState("");
    const [model, setModel] = useState("");
    const [serial, setSerial] = useState("");
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);

    const navigate = useNavigate();


    const GetItems = async () => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/item`, {
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
                setMessage(shelfData.message);
                setItems([]);
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

    const DeleteItem = async (id) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/item/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });

            const shelfData = await shelfRes.json();

            if (!shelfData.success){
                setMessage("Failed to delete item");
                return;
            }

            await GetItems();
        }
        catch(error){
            setMessage("Failed to delete item");
            console.log(`Failed to delete item : ${error}`);
        }
        
    }


    const handleCreation = async (e) => {

        e.preventDefault();

        const creationRes = await fetch(
            `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/item`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ manufacturer: manufacturer,
                model: model,
                serial: serial
            }),
          });
    

          if (creationRes.status == 401){
            setMessage("not logged in");
            loginNeeded();
            return;
          }


          const creationData = await creationRes.json();
          if (!creationData.success) {
            setMessage(`Item creation failed : ${creationData.message}`);
        }

        setMessage("");
        setManufacturer("");
        setModel("");
        setSerial("");

        await GetItems();
    }

    

    const redirectToHomePage = () => {
        navigate("/home");
    }



    return (

        <div>
            <div>
            <button className="header-button" onClick={redirectToHomePage}>Back</button>
            </div>
            <form onSubmit={handleCreation}>
                <input
                type="text"
                placeholder="manufacturer"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
                required
                /><br/>

                <input
                type="text"
                placeholder="model"
                value={model}
                onChange={e => setModel(e.target.value)}
                required
                /><br/>

                <input
                type="text"
                placeholder="serial"
                value={serial}
                onChange={e => setSerial(e.target.value)}
                required
                /><br/>
                <button className="header-button" type="submit">Create</button>
            </form>

             <div>

                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Manufacturer</th>
                            <th>Model</th>
                            <th>Serial</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.manufacturer}</td>
                                <td>{item.model}</td>
                                <td>{item.serial}</td>
                                <td>
                                    <button className="basic-button"
                                        onClick={() => {DeleteItem(item.id)}}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            
            </div>
       

    

      <p>{message}</p>
        </div>
    )
}





export default Items;