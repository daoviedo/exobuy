import React from 'react';
import DisplayCart from './DisplayCart';
import Purchase from '../../Containers/Purchase';
import axios from 'axios';

export default function Cart(){
    const [cart, changeCart] = React.useState([]);
    const [total, changeTotal] = React.useState();
    const [pageState, changepageState] = React.useState(0);
    const [socketToken, changeSocketToken] = React.useState("");

    function DisplayModule (){
        switch(pageState){
            case 0:
                return <DisplayCart modifyCart={modifyCart} data={cart} total={total} checkout={() => retrieveToken()}/>
            case 1:
                return <Purchase goBack={() => changepageState(0)} socketToken={socketToken} token={document.cookie.split('=')[1]}/>
            default:
                return <DisplayCart data={cart}/>
        }
    }

    const retrieveToken = () =>{
        axios.get('http://localhost:4000/account/socket', {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.split('=')[1]
            }
        })
        .then(result => changeSocketToken(result.data.token))
        .then(() => changepageState(1))
    }

    const retrieveCart = () =>{
        axios.get('https://api.dev.myexobuy.com/cart', {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.split('=')[1]
            }
        })
        .then(result => {changeCart(result.data.cart); changeTotal(result.data.cost)})
    }

    const modifyCart = (detailID, amount) =>{
        axios.patch('https://api.dev.myexobuy.com/cart', {
            detail_id: detailID,
            cantidad: amount
        }, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + document.cookie.split('=')[1]
            }
        })
        .then(() => {retrieveCart()})
    }

    React.useEffect(() => {

        axios.get('https://api.dev.myexobuy.com/cart', {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.split('=')[1]
            }
        })
        .then(result => {changeCart(result.data.cart); changeTotal(result.data.cost)})
        
    }, []);

    return (
        <div>
            <DisplayModule />
        </div>
    );
}