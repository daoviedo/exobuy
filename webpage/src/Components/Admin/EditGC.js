import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import "../Buy/store.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import axios from "axios";
import { TextField } from "@material-ui/core";


export default function CreateCategory(props) {
  //api call to modify a category
  const ModifyCategory = () => {
    axios
      .patch(
        "https://api.dev.myexobuy.com/stores/mercados",
        {
          mercado: props.category,
          mercado_id: props.selCat.COD_MERCADO,
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
          Edit Categoria Global
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modificar la categoria
          </DialogContentText>
          <TextField
            value={props.category}
            onChange={(event) => props.setCategory(event.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            label="Categoria Global"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            variant="contained"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={ModifyCategory}
            disabled={props.category === props.selCat.MERCADO}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
