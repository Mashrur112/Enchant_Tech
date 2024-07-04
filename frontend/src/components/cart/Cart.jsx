import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { CartContext } from "./CartContext";

export const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const { fetchCartCount } = useContext(CartContext);

    useEffect(() => {
        fetch('http://localhost:4000/api/cart')
            .then(response => response.json())
            .then(data => setCartData(data));
    }, []);

    const rmv_frm_crt = (id) => {
        // Update the cart data state immediately
        setCartData(prevCartData => prevCartData.filter(item => item.id !== id));
        
        // Make the DELETE request to the server
        fetch(`http://localhost:4000/api/cart/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(() => {
            // Fetch and update the cart count from context
            fetchCartCount();
        })
        .catch(error => {
            // Handle any errors and revert the state update if necessary
            console.error('Error removing item from cart:', error);
            // Optionally, you might want to refetch the cart data from server to ensure consistency
            fetch('http://localhost:4000/api/cart')
                .then(response => response.json())
                .then(data => setCartData(data));
        });
    };

    return (
        <div>
            <ul className="Cart_headers">
                <li>IMAGE</li>
                <li>NAME</li>
                <li>COUNT</li>
                <li>PRICE</li>
                <li>REMOVE</li>
            </ul>
            {cartData.map((item, index) => (
                <div className="cart_list" key={index}>
                    <ul className="data_list">
                        <li><img src={`../assets/PC/a.jpg`} alt={item.title} /></li>
                        <li>{item.title}</li>
                        <li>{item.count || 1}</li> {/* Assuming there's a count field or defaulting to 1 */}
                        <li>{item.price}</li>
                        <li><button onClick={() => rmv_frm_crt(item.id)} className="remove">Remove</button></li>
                    </ul>
                </div>
            ))}
        </div>
    );
};
