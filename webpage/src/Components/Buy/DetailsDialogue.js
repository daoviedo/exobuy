import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import "../Buy/store.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function AddCartDialog(props) {
  const { item, close, open, Availability } = props;
  const handleClose = () => {
    close();
  };

  //function that displays the item price given price variable
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
            margin: "auto"
          }}
          className="itemimg"
        />
        <DialogContentText>
          {'Detalle: ' + item.PRODUCTO_DETALLE}
          <br/>
          {'Peso: ' + item.PESO_PRODUCTO}
        </DialogContentText>
        {ItemPrice(item.COSTO_PRODUCTO)}
        <ul className="dialog_ul">{Availability(item.CANTIDAD_ACTUAL)}</ul>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
