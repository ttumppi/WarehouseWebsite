import React, { useState, useEffect } from "react";

const CreateItem = ({ loginNeeded }) => {
    const [manufacturer, setManufacturer] = useState("");
    const [model, setModel] = useState("");
    const [serial, setSerial] = useState("");
    const [message, setMessage] = useState("");


    const handleCreation = async () => {

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
    }

    return (

        <div>
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
                <button type="submit">Create</button>
      </form>
      <p>{message}</p>
        </div>
    )
}





export default CreateItem;