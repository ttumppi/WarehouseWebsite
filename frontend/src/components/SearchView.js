import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StateContext from "./StateContext";

const SearchView = () => {
    const [shelfItems, setShelfItems] = useState({});
    const [message, setMessage] = useState("");
    const {search } = useParams();

    const { setLoginNeeded } = useContext(StateContext);

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
                setShelfs(shelfData.data)
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
            {Object.entries(shelfItems).map(([shelf, items]) => (
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
                                    <td>{item.Model}</td>
                                    <td>{item.Serial}</td>
                                    <td>{item.Balance}</td>
                                    <td>{item.Location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}

            <p>{message}</p>
        </div>
    )
}

export default SearchView;