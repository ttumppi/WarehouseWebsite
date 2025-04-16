import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StateContext from "./StateContext";

const SearchView = () => {
    const [shelfItems, setShelfItems] = useState({});
    const [message, setMessage] = useState("");
    const {search } = useParams();
    const navigate = useNavigate();

    const { setLoginNeeded } = useContext(StateContext);


    const redirectToHomePage = () => {
        navigate("/");
    }

    const Search = async () => {
    
            try{
                const shelfsRes = await fetch(
                    `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/search/${search}`, {
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
                    return;
                }
                
                setMessage("");
                setShelfItems(shelfData.data)
            }
    
            catch(error){
                setMessage("Failed to fetch shelfs");
                console.log(`Failed to load page: ${error}`);
            }
            
        }
    
        
    
        useEffect(() => {
    
            const searchWrapper = async () => {
                await Search();
            }
            
            searchWrapper();
        }, []);


    return (
        <div>
            <div>
                <button className="default-button"
                    onClick={redirectToHomePage}>
                    Back
                </button>
            </div>
            {Object.entries(shelfItems).map(([shelf, items]) => (

                (items.length != 0) && (
                <div>
                    <h2>{shelf}</h2>

                    <table border="1" cellPadding="8">
                        <thead>
                            <tr>
                                <th>Manufacturer</th>
                                <th>Model</th>
                                <th>Serial</th>
                                <th>Balance</th>
                                <th>Location</th>
                                </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.manufacturer}</td>
                                    <td>{item.model}</td>
                                    <td>{item.serial}</td>
                                    <td>{item.balance}</td>
                                    <td>{item.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>
                )
            ))}

            <p>{message}</p>
        </div>
    )
}

export default SearchView;