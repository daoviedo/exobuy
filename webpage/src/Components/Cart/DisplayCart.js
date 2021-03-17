import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, Typography } from "@material-ui/core";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

//set the style of the components
const useStyles = makeStyles({
  table: {
    width: "100%"
  },
  paper: {
    width: 600,
    margin: "auto",
    marginTop: 200
  }
});

//array that holds the quantity selection options
const quantitySelection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function DisplayCart(props) {
  const classes = useStyles();

  //function that counts how many items in the cart
  function countItems() {
    let citems = 0;
    for (let i in props.data) {
      citems += props.data[i].CANT_PRODUCTO;
    }
    if (citems === 1) {
      return citems + " item";
    } else {
      return citems + " items";
    }
  }

  //function that returns the total WONT BE NECESSARY WITH THE API RETURNS
  function totalAmount() {
    if (props.total === undefined) {
      return "";
    } else if (props.total === null) {
      let retvar = 0;
      return retvar.toFixed(2);
    } else {
      let retvar = props.total;
      return retvar.toFixed(2);
    }
  }

  //function that displays the checkout button and disables when cart is empty
  function DisplayButton() {
    if (props.data.length === 0) {
      return <div />;
    } else {
      return (
        <Button
          disabled={CheckButton()}
          style={{ marginTop: 5 }}
          onClick={props.checkout}
          variant="contained"
          color="primary"
        >
          CHECK OUT
        </Button>
      );
    }
  }

  //checks to see if any item is exceeding the amount left in store and wont let them checkout
  function CheckButton() {
    /*
    for (let x in props.data) {
      if (props.data[x].EXCEEDS === 1) {
        return true;
      }
    }
    
    return false;
    */
   return true;
  }

  //function to display availability of a product
  function Availability(item) {
    if (item.EXCEEDS === 1) {
      return (
        <Typography variant="caption" style={{ color: "red" }}>
          {"Only " + item.CANTIDAD_ACTUAL + " left in stock"}
        </Typography>
      );
    } else if (item.CANTIDAD_ACTUAL > 9) {
      return (
        <Typography variant="caption" style={{ color: "green" }}>
          In Stock
        </Typography>
      );
    } else {
      return (
        <Typography variant="caption" style={{ color: "orange" }}>
          {"Only " + item.CANTIDAD_ACTUAL + " left in stock"}
        </Typography>
      );
    }
  }
  return (
    <TableContainer className={classes.paper} component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map(row => (
            <TableRow key={row.DETAIL_ID}>
              <TableCell component="th" scope="row">
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      backgroundImage: "url('" + row.IMG_URL + "')",
                      height: 60,
                      width: 60,
                      backgroundSize: "cover"
                    }}
                  />
                  <div style={{ paddingTop: 10 }}>
                    {row.PRODUCTO}
                    <br />
                    {Availability(row)}
                  </div>
                </div>
              </TableCell>
              <TableCell align="right">
                <Select
                  value={parseInt(row.CANT_PRODUCTO)}
                  onChange={event =>
                    props.modifyCart(row.DETAIL_ID, event.target.value)
                  }
                >
                  <MenuItem value={0}>0 (Delete)</MenuItem>
                  {quantitySelection.map(sel => (
                    <MenuItem
                      key={sel}
                      disabled={sel > row.CANTIDAD_ACTUAL}
                      value={sel}
                    >
                      {sel}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="right">
                {row.COSTO_PRODUCTO.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell align="right">
              {"Subtotal (" + countItems() + "): " + totalAmount()}
              <br />
              {"Delivery fee: 3.00"}
              <br />
              {"Tax (7%): " + (totalAmount() * .07).toFixed(2)}
              <br />
              {"Total: " + ((parseFloat(totalAmount()) * .07) + parseFloat(totalAmount()) + 3).toFixed(2)}
              <br />
              <DisplayButton />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
