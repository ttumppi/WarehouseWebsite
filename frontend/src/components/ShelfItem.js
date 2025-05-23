import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {Queue} from "../queue.js";
import StateContext from "./StateContext.js";

const ShelfItem = () => {
    const { setLoginNeeded, role} = useContext(StateContext);
    const {shelf, id } = useParams();
    const navigate = useNavigate();

    const [balance, setBalance] = useState(null);
    const [location, setLocation] = useState(null);
    const [currentShelf, setCurrentShelf] = useState(shelf);
    const [shelfs, setShelfs] = useState([]);
    const [locations, setLocations] = useState({});
    const [item, setItem] = useState(null);
    const [message, setMessage] = useState("");

    let initialBalance = useRef(null);
    let initialShelf = useRef(shelf);
    let initialLocation = useRef(null);

    const queue = useRef(new Queue());


    const RedirectToShelfView = () => {
        navigate(`/shelf/${currentShelf}`);
    }

  
    
   

    const GetItem = async () => {
      
      
        const shelfRes = await fetch(
            `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/item/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
            });

        if (shelfRes.status == 401){
            setMessage("not logged in");
            setLoginNeeded();
            return;
        }

        const shelfData = await shelfRes.json();

        if (!shelfData.success){
            setMessage("Failed to get item data");
            return;
        }

        setItem(shelfData.item);
        setLocation(shelfData.item.location);
        setBalance(shelfData.item.balance);

        initialBalance.current = shelfData.item.balance;
        initialLocation.current = shelfData.item.location;
        initialShelf.current = shelf;
        

        const itemRes = await fetch(
            `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/item/${shelfData.item.item_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
            });

        const itemData = await itemRes.json();

        if (!itemData.success){
            setMessage("Failed to get item specific info");
            return;
        }

        

        shelfData.item["manufacturer"] = itemData.item.manufacturer;
        shelfData.item["model"] = itemData.item.model;
        shelfData.item["serial"] = itemData.item.serial;

        setItem(shelfData.item);

        setMessage("");

    }

    const GetShelfs = async () => {

        try{
            const shelfsRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelfs`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    
            const shelfData = await shelfsRes.json();
            if (shelfsRes.status == 401){
                setMessage("Not logged in");
                setLoginNeeded();
                return;
            }
    
            if (!shelfData.success){
                setMessage(shelfData.message);
                setShelfs([]);
                return;
            }
            
            setMessage("");
            setShelfs(shelfData.data)

            for (let i = 0; i < shelfData.data.length; i++){
                queue.current.Enqueue(shelfData.data[i]);
            }
        }

        catch(error){
            setMessage("Failed to fetch shelfs");
            console.log(`Failed to load page: ${error}`);
        }
        
    }

    const GetAvailableLocations = async (shelfName) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelfName}/locations`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
        

            if (shelfRes.status == 401){
                setMessage("Not logged in");
                setLoginNeeded();
                return;
            }

            const shelfData = await shelfRes.json();
    
               
        
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
                
            setMessage("");
                
               
            let locationCopy = {};

            for (let shelf in locations){
                locationCopy[shelf] = locations[shelf];
            }

            locationCopy[shelfName] = shelfData.locations;

            if (shelfName == shelf){
                locationCopy[shelfName].splice(location-1, 0, {"num":location});
            }

            setLocations(locationCopy);
        }
    
        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }


    const TransferItem = async () => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/item/transfer`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    currentLocation : initialLocation.current,
                    targetShelf: currentShelf,
                    targetLocation: location
                })
                });

            const shelfData = await shelfRes.json();

            if (!shelfData.success){
                setMessage("Failed to transfer item");
                return;
            }

            setMessage("");

            if (currentShelf != shelf){
                RedirectToShelfView();
            }
        }
        catch(error){
            setMessage("Failed to transfer item");
            console.log(`Failed to transfer item: ${error}`);
        }
    }

    const UpdateBalance = async () => {
        try{

            const balanceChange = balance - initialBalance.current;
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/item/balance`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    amount: balanceChange,
                    id: id
                })
                });

            const shelfData = await shelfRes.json();

            if (!shelfData.success){
                setMessage("Failed to update balance");
                return;
            }

            setMessage("");

            
        }
        catch(error){
            setMessage("Failed to update balance");
            console.log("Failed to update balance")
        }
    }

    const UpdateItem = async () => {
        if (initialBalance.current != balance){
            await UpdateBalance();
        }
        if (initialShelf.current != currentShelf || 
            initialLocation.current != location){
            await TransferItem();
        }
        setMessage("Saved");
        await GetItem();
    }

    useEffect( () => {
        const wrapper = async () => {
            await GetItem();
            await GetShelfs();
        }
        wrapper();
    },[]);

    useEffect(() => {
        const wrapper = async () => {
            if (!queue.current.Empty()){
                await GetAvailableLocations(queue.current.Dequeue().shelf_id);
            }
        }

        wrapper();
        
    }, [shelfs]);

    useEffect( () => {
        const wrapper = async () => {
           if (!queue.current.Empty()){
                await GetAvailableLocations(queue.current.Dequeue().shelf_id);
            }
        }
        wrapper();
    }, [locations])


   
    return (
        <div>

            <button className="default-button"
            onClick={RedirectToShelfView} >Back</button>
            <br/>

            <h3>Manufacturer</h3>
            <p>{(item == null) ? "--" : item?.manufacturer}</p>
            <h3>Model</h3>
            <p>{(item == null) ? "--"  : item?.model}</p>
            <h3>Serial</h3>
            <p>{(item == null) ? "--" : item?.serial}</p>

            <h3>Shelf</h3>
            <select
                value={currentShelf}
                disabled={(role != "Admin" && role != "Warehouse worker")}
                onChange={(e) => setCurrentShelf(e.target.value)}>
                {shelfs.map((shelf) => (
                    <option key={shelf.id} value={shelf.shelf_id}>
                        {shelf.shelf_id}
                    </option>
                ))}
            </select>
            
            <h3>Location</h3>
            <select
            value={location ?? 3}
            disabled={(role != "Admin" && role != "Warehouse worker")}
                onChange={(e) => setLocation(parseInt(e.target.value))}>
                disabled={!locations || !locations[currentShelf]}
                {
                    (!locations || !locations[currentShelf]) ? 
                    <option> -- loading --</option> :
                    locations[currentShelf].map((loc) => (
                        <option key={loc.num} value={loc.num}>
                            {loc.num}
                        </option>
                    ))
                }
                
            </select>

            <h3>Balance</h3>
            <input
                disabled={(role != "Admin" && role != "Warehouse worker")}
                type="number"
                min="0"
                value={(balance == null) ? 0 : balance}
                onChange={(e) => setBalance(parseInt(e.target.value))}
                />

            <br /><br />
            <button
                disabled={initialBalance.current === balance
                     && initialLocation.current === location
                      && initialShelf.current === currentShelf}
                onClick={UpdateItem}>
                    Save
            </button>

            {message && <p>{message}</p>}
        </div>
    )

}



export default ShelfItem;