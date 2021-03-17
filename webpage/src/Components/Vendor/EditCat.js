import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import "../Buy/store.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import axios from "axios";

export default function CreateCategory(props) {
  //api call to modify a category
  const ModifyCategory = () => {
    axios
      .patch(
        "https://api.dev.myexobuy.com/stores/categories",
        {
          category: props.category,
          cod_cat: props.selCat.COD_CATEGORIA_PRODUCTO,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1],
          },
        }
      )
      .then(() => {
        props.handleClose();
        props.fetchCategories();
      });
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={props.handleClose}
        aria-labelledby="simple-dialog-title"
        open={props.open}
      >
        <DialogTitle style={{ textAlign: "center" }} id="simple-dialog-title">
          Create New Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Crea una nueva categoria de productos para su tienda.
          </DialogContentText>

          <label for="fname">Categoria:</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={props.category}
            onChange={(event) => props.setCategory(event.target.value)}
          ></input>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            variant="contained"
            color="primary"
          >
            Cancel
          </Button>
          <button
            disabled={props.category === props.selCat.CATEGORIA_PRODUCTO}
            onClick={ModifyCategory}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Cambiar
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
