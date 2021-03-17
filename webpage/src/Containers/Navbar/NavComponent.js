import React from 'react';
import Cartlogo from '@material-ui/icons/ShoppingCart';
import {Badge} from '@material-ui/core';

export default function NavComponent(props){
    if(props.isLogged){
        switch(window.location.pathname){
            case "/":
                return <ul className="nav__links">
                <li><a className="selected" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="lilink" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="lilink" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="lilinkicon" href="/cart"><Badge style={{marginTop: -5}} color="primary" badgeContent={props.itemcount}><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></Badge></a></li>
                </ul>

            case "/buy":
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="selected" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="lilink" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="lilink" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="lilinkicon" href="/cart"><Badge style={{marginTop: -5}} color="primary" badgeContent={props.itemcount}><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></Badge></a></li>
                </ul>
            case "/store":
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="lilink" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="lilink" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="lilinkicon" href="/cart"><Badge style={{marginTop: -5}} color="primary" badgeContent={props.itemcount}><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></Badge></a></li>
                </ul>

            case "/vendor":
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="selected" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="lilink" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="lilinkicon" href="/cart"><Badge style={{marginTop: -5}} color="primary" badgeContent={props.itemcount}><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></Badge></a></li>
                </ul>
            case "/admin":
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="lilink" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="selected" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="lilink" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="lilinkicon" href="/cart"><Badge style={{marginTop: -5}} color="primary" badgeContent={props.itemcount}><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></Badge></a></li>
                </ul>
            
            case "/account":
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="lilink" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="selected" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="lilinkicon" href="/cart"><Badge style={{marginTop: -5}} color="primary" badgeContent={props.itemcount}><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></Badge></a></li>
                </ul>
            case "/cart":
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="lilink" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="lilink" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="selectedicon" href="/cart"><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></a></li>
                </ul>
            default:
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/buy">Buy</a></li> : React.Fragment}
                {props.access === 3 || props.access === 5 ? <li><a className="lilink" href="/vendor">Mi Comercio</a></li> : React.Fragment}
                {props.access === 1 || props.access === 5 ? <li><a className="lilink" href="/admin">Admin</a></li> : React.Fragment}
                <li><a className="lilink" href="/account">Perfil</a></li>
                <li><a className="lilink" href="/" onClick={() => document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"}>Cerrar Sesión</a></li>
                <li><a className="lilinkicon" href="/cart"><Cartlogo style={{marginTop: -10, position:'relative', top: '5px'}}/></a></li>
                </ul>
        }
    }
    else{
        switch(window.location.pathname){
            case "/":
                return <ul className="nav__links">
                <li><a className="selected" href="/">Home</a></li>
                <li><a className="lilink" href="login">Iniciar Sesión</a></li>
                </ul>
            case "/login":
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                <li><a className="selected" href="login">Iniciar Sesión</a></li>
                </ul>
            default:
                return <ul className="nav__links">
                <li><a className="lilink" href="/">Home</a></li>
                <li><a className="lilink" href="login">Iniciar Sesión</a></li>
                </ul>
        }
    }
}