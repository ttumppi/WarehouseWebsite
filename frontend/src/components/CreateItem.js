import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateItem = ({ loginNeeded }) => {
    const [manufacturer, setManufacturer] = useState("");
    const [model, setModel] = useState("");
    const [serial, setSerial] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();


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
      <p>{message}</p>
        </div>
    )
}





export default CreateItem;