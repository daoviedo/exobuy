import React from 'react';
import axios from 'axios';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DisplayStores from './DisplayStores';

//function to set the styles of the page elements
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
        marginLeft: theme.spacing(2),
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
        width: 130,
      },
    }
  }));

export default function Buy(){
    const classes = useStyles();
    const [globalCategories, changeGC] = React.useState([]);
    const [selectedCategory, changeSelCat] = React.useState(0);
    const [search, changeSearch] = React.useState("");
    const [stores, changeStores] = React.useState([]);

    //funciton that handles the event change of a category
    const handleChangeCat = event => {
      changeSelCat(event.target.value);
      searchQuery(search, event.target.value);
    };

    //function that handles the event change of Search
    const handleChangeSer = event => {
      changeSearch(event.target.value);
      searchQuery(event.target.value, selectedCategory);
    };

    //api calls depending on field and category
    const searchQuery = (field, category) => {
        if(category === 0){
            axios.get('https://api.dev.myexobuy.com/stores/search/' + encodeURIComponent(field.toLowerCase()), {
            })
            .then(result => changeStores(result.data.data))
        }
        else{
            axios.get('https://api.dev.myexobuy.com/stores/search/category/' + category + '/' + encodeURIComponent(field.toLowerCase()), {
            })
            .then(result => changeStores(result.data.data))
        }
    }

    React.useEffect(() => {
        //api call to get all merchants
        axios.get('https://api.dev.myexobuy.com/stores/mercados', {
        })
        .then(result => changeGC(result.data.data))
        //api call to get all stores
        axios.get('https://api.dev.myexobuy.com/stores/search', {
        })
        .then(result => changeStores(result.data.data))
    }, []);

    return (
      <div>
      <div style={{height: 54, marginTop: 65, background: 'linear-gradient(to bottom, rgb(3,146,93), rgb(8,178,115))'}}>
    <div style={{width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 3}}>
        <TextField onChange={handleChangeCat} style={{width: 150, marginRight: 10}} select label="Global Category" value={selectedCategory}>
            <MenuItem value={0}>All</MenuItem>
            {globalCategories.map(cat => (
              <MenuItem key={cat.COD_MERCADO} value={cat.COD_MERCADO}>{cat.MERCADO}</MenuItem>
            ))}
            
        </TextField>
    <div style={{width: 250}}>
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
    </div>
    </div>
    <div style={{textAlign: 'center'}}>
              <DisplayStores stores={stores}/>
              </div>
    </div>
    );
}