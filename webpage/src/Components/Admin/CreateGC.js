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
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState("");

  //handles the open of category dialog
  const handleOpen = () => {
    setOpen(true);
  };
  //handles the closing of the dialog
  const handleClose = () => {
    setOpen(false);
    setCategory("");
  };

  //api call to create a category
  const CreateCategory = () => {
    axios
      .post(
        "https://api.dev.myexobuy.com/stores/mercados",
        {
          mercado: category
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1]
          }
        }
      )
      .then(() => {
        handleClose();
        props.fetchCategories();
      });
  };

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create New Category
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle style={{ textAlign: "center" }} id="simple-dialog-title">
          Create New Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Crea una nueva categoria global.
          </DialogContentText>

          <TextField
            value={category}
            onChange={event => setCategory(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            id="category"
            label="Categoria"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button
            disabled={category === ""}
            onClick={CreateCategory}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
