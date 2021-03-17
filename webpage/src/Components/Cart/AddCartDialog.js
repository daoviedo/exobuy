import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import "../Buy/store.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import axios from "axios";

const quantitySelection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function AddCartDialog(props) {
  const { item, close, open, Availability } = props;
  const [amount, setAmount] = React.useState(1);

  //closes the dialog box
  const handleClose = () => {
    close();
  };
  //check for error handling
  const handleErr = (err) => {
    console.log("here");
    window.location.reload();
  };

  //api call to add a product to cart
  const addcart = () => {
    axios
      .post(
        "https://api.dev.myexobuy.com/cart",
        {
          cod_producto: item.COD_PRODUCTO,
          cantidad: amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1],
          },
        }
      )
      .then(() => {
        close();
        setAmount(1);
        props.researchCart();
        props.refcartitems();
      })
      .catch((err) => handleErr(err));
  };

  //function to handle event of selection change of quantity
  const changeSelection = (event) => {
    setAmount(event.target.value);
  };

  //function that renders the item price
  function ItemPrice(price) {
    if (price !== undefined) {
      const itemprice = price.toFixed(2);
      const arr = itemprice.split(".");
      return (
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 28 }}>
          <sup className="sup">$</sup>
          {arr[0]}
          <sup className="sup">{arr[1]}</sup>
        </div>
      );
    }
  }
  //returns the output html
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle style={{ textAlign: "center" }} id="simple-dialog-title">
        {item.PRODUCTO}
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            backgroundImage: "url('" + item.IMG_URL + "')",
            margin: "auto",
          }}
          className="itemimg"
        />
        <DialogContentText>
          {"Detalle: " + item.PRODUCTO_DETALLE}
          <br />
          {"Peso: " + item.PESO_PRODUCTO}
        </DialogContentText>
        {ItemPrice(item.COSTO_PRODUCTO)}
        <ul className="dialog_ul">{Availability(item.CANTIDAD_ACTUAL)}</ul>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16 }}>
          Quantity:
          <Select
            style={{ marginLeft: 5, textAlign: "center" }}
            title="Quantity"
            value={amount}
            onChange={changeSelection}
          >
            {quantitySelection.map((sel) => (
              <MenuItem
                key={sel}
                disabled={sel > item.CANTIDAD_ACTUAL}
                value={sel}
              >
                {sel}
              </MenuItem>
            ))}
          </Select>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button onClick={addcart} variant="contained" color="primary" autoFocus>
          ADD TO CART
        </Button>
      </DialogActions>
    </Dialog>
  );
}
