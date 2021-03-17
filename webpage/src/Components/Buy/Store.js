import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import './store.css';
import { Divider, TextField, MenuItem, Button } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import AddCartDialog from '../Cart/AddCartDialog';
import { Redirect } from 'react-router-dom';
import DetailsDialogue from './DetailsDialogue';

//creates the theme colors and font
const theme1 = createMuiTheme({
    palette: {
      primary: {main: '#06A66A'},
    },
    typography: {
      fontFamily: 'Montserrat'
    }
  });

//applies the styling to components
const useStyles = makeStyles(theme => ({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: 0,
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginTop: 2,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      height: 28,
      [theme.breakpoints.up('md')]: {
        width: 150,
      },
    }
}));

export default function Store(props){
    const classes = useStyles();
    const [details, changeDetails] = React.useState({});
    const [categories, changeCategories] = React.useState([]);
    const [products, changeProducts] = React.useState([]);
    const [selCat, changeSelCat] = React.useState(0);
    const [search, changeSearch] = React.useState("");
    const [storeFound, changeFound] = React.useState(false);
    const [cart, setcart] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [opendes, setOpendes] = React.useState(false);
    const [selItem, setItem] = React.useState({});
    const [redir, setredir] = React.useState(false);



    //handles the opening of the store when clicked
    const handleClickOpen = (item) => {
        if(props.isLogged){
            setItem(item);
            setOpen(true);
        }
        else{
            //redirects to login if not logged
            setredir(true);
        }
        
    };

    //handles the description tab when clicking on a product
    const handleDesc = (item) => {
            setItem(item);
            setOpendes(true);
    };

    //handles the event to open the product
    const handleClickClose = () => {
        setOpen(false);
    };

    //handles the event to close the product
    const handleClickClosedes = () => {
        setOpendes(false);
    };


    //function that is called to redirect back to login if attempt to purchase an item and not logged
    function RenRedir(){
        if(redir){
            return <Redirect to={{pathname: '/login', state: {from: props.location.pathname + props.location.search}}}/>

        }
        else{
            return <div/>
        }
    }

    //grabs the search parameters, looking for which store id the page is on
    const qvalues = queryString.parse(props.location.search);

    //api to search for products
    const searchQuery = (field, category) => {
        if(category === 0){
            axios.get('https://api.dev.myexobuy.com/stores/products/' + qvalues.id + '/' + encodeURIComponent(field.toLowerCase()), {
            })
            .then(result => changeProducts(result.data.data))
        }
        else{
            axios.get('https://api.dev.myexobuy.com/stores/products/category/' + qvalues.id + '/' + category + '/' + encodeURIComponent(field.toLowerCase()), {
            })
            .then(result => changeProducts(result.data.data))
        }
    }

    //api call to research what's in the user's cart
    const researchCart = () => {
        axios.get('https://api.dev.myexobuy.com/cart', {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.split('=')[1]
            }
        })
        .then(result => setcart(cartify(result.data.cart)))
    }

    //handle event of category change
    const handleChangeCat = event => {
        changeSelCat(event.target.value);
        searchQuery(search, event.target.value);
      };
      //handle event of search change
      const handleChangeSer = event => {
        changeSearch(event.target.value);
        searchQuery(event.target.value, selCat);
      };

    React.useEffect(() => {
        const values = queryString.parse(props.location.search);
        //checks to see if id is actually defined, is needed to search correctly
        if (values.id === undefined || values.id === ''){

        }
        else{
            if(props.isLogged){
                axios.get('https://api.dev.myexobuy.com/cart', {
                    headers: {
                        'Authorization': 'Bearer ' + document.cookie.split('=')[1]
                    }
                })
                .then(result => setcart(cartify(result.data.cart)))
            }
            axios.get('https://api.dev.myexobuy.com/stores/details/'+values.id, {
            })
            .then(result => {changeDetails(result.data.data[0]); if(result.data.data.length > 0){changeFound(true)}})
            axios.get('https://api.dev.myexobuy.com/stores/categories/'+values.id, {
            })
            .then(result => changeCategories(result.data.data))
            axios.get('https://api.dev.myexobuy.com/stores/products/'+values.id, {
            })
            .then(result => changeProducts(result.data.data))
        }
        
    }, [props]);

    //function to push the cart into an array for use
    function cartify(jsoncart){
        let cartarr = [];
        for(let x in jsoncart){
            cartarr.push(jsoncart[x].COD_PRODUCTO)
        }
        return cartarr;
    }
    //function that returns the button depending on status of cart
    function returnButton (item){
        if(cart.includes(item.COD_PRODUCTO)){
            return <Button disabled variant="contained" color="primary">ALREADY IN CART</Button>
        }
        else{
            return <Button disabled={item.CANTIDAD_ACTUAL === 0} onClick={() => handleClickOpen(item)} variant="contained" color="primary">ADD TO CART</Button>
        }
    }

    //function that returns the price of the product
    function ItemPrice(price){
        const itemprice = price.toFixed(2);
        const arr = itemprice.split('.');
        return <div><sup className="sup">$</sup>{arr[0]}<sup className="sup">{arr[1]}</sup></div>
    }
    //function that returns the availability of an item
    function Availability(itemsLeft) {
        if(itemsLeft === 0){
          return <li style={{color: 'red', fontSize: 14}}>Out of stock</li>
        }
        else if(itemsLeft > 9){
          return <li style={{color: 'green', fontSize: 14}}>In Stock</li>
        }
        else{
          return <li style={{color: 'orange', fontSize: 14}}>{'Only ' + itemsLeft + ' left in stock'}</li>
        }
    }

    //return empty div if the store id does not exist
    if ((qvalues.id === undefined || qvalues.id === '') || storeFound === false){
        return (<div/>);
    }
    else{
        return(
            <div className="page">
                <RenRedir />
                <div className="leftside">
                    <div className="detailsContainer">
                        <div className="img" style={{backgroundImage: "url('" + details.IMG_URL + "')", borderRadius: '50%'}}/>
                        <ul className="store_ul">
                            <li className="store_title">{details.TIENDA}</li>
                            <li className="store_mercado">Mercado</li>
                            <li className="store_direccion">{details.DIRECCION_FISICA}</li>
                        </ul>
                    </div>
                    <Divider />
                    <div style={{textAlign: 'center'}}>
                        <TextField onChange={handleChangeCat} style={{width: 150, marginTop: 20}} select label="Category" value={selCat}>
                            <MenuItem value={0}>All</MenuItem>
                            {categories.map(cat => (
                                <MenuItem key={cat.COD_CATEGORIA_PRODUCTO} value={cat.COD_CATEGORIA_PRODUCTO}>{cat.CATEGORIA_PRODUCTO}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    
                    <div style={{width: 220, margin: 'auto', marginTop: 20}}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            value={search}
                            onChange={handleChangeSer}
                            placeholder="Search…"
                            classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    </div>
                    <Divider style={{marginTop: 20}}/>
                </div>
                <ThemeProvider theme={theme1}>
                <div className="itemscont">
                    {products.map(item => (
                        <div key={item.COD_PRODUCTO} className="item">
                            <div style={{backgroundImage: "url('" + item.IMG_URL + "')"}} className="itemimg">
                                
                            </div>
                            <div className ="itemtext">
                                <ul className="itemlist">
                                    <li className="itemname">
                                        {item.PRODUCTO}
                                    </li>
                                    <li className="itemprice">
                                        {ItemPrice(item.COSTO_PRODUCTO)}
                                    </li>
                                    <button onClick={() => handleDesc(item)} className="itemdetails">
                                        Details
                                    </button>
                                    {Availability(item.CANTIDAD_ACTUAL)}
                                </ul>
                            </div>
                            <div className="actions">
                                <div style={{textAlign: 'center'}}>
                                {returnButton(item)}
                                </div>
                                <Divider style={{marginTop: 10}}/>
                            </div>
                        </div>
                    ))}
                    
                    
                </div>
                <AddCartDialog refcartitems={props.refcartitems} open={open} researchCart={researchCart} Availability={Availability} item={selItem} close={handleClickClose} />
                <DetailsDialogue refcartitems={props.refcartitems} open={opendes} researchCart={researchCart} Availability={Availability} item={selItem} close={handleClickClosedes} />
                </ThemeProvider>
            </div>
            );
    }
    
}