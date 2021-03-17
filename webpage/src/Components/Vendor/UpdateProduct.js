import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import "../Buy/store.css";
import "./styling.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import axios from "axios";
import { TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";

const inputProps = {
  min: 1
};

const invinputProps = {
  step: 1
};

export default function CreateProduct(props) {
  const {
    open,
    setOpen,
    selectedHold,
    selectedProduct,
    price,
    setPrice,
    fetchProducts,
    fileprod,
    setFileprod,
    filelabelprod,
    setfilelabelprod
  } = props;

  const [invUpdate, setinvUpdate] = React.useState("");

  const [creating, setcreating] = React.useState(false);

  const onChange = (e) => {
    setFileprod(e.target.files[0]);
    try {
      setfilelabelprod(e.target.files[0].name);
    } catch {
      setfilelabelprod("Choose a file...");
    }
  };

  //api calls that update a producto depending on what has been changed
  const updateProductfetch = () => {
    setcreating(true);
    if(fileprod !== undefined){
      let bodyFormData = new FormData();
      bodyFormData.set("product_id", selectedProduct.COD_PRODUCTO);
      bodyFormData.append("productImage", fileprod);
      axios
      .patch("https://api.dev.myexobuy.com/stores/productimg", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + document.cookie.split("=")[1]
        }
      });
    }
    if (price === selectedProduct.COSTO_PRODUCTO) {
      axios
        .patch(
          "https://api.dev.myexobuy.com/stores/updateproduct/inventory/" +
            selectedProduct.COD_PRODUCTO,
          { invUpdate: invUpdate },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + document.cookie.split("=")[1]
            }
          }
        )
        .then(() => {
          handleClose();
          fetchProducts();
        });
    } else if (invUpdate === "") {
      axios
        .patch(
          "https://api.dev.myexobuy.com/stores/updateproduct/price/" +
            selectedProduct.COD_PRODUCTO,
          { newPrice: price },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + document.cookie.split("=")[1]
            }
          }
        )
        .then(() => {
          handleClose();
          fetchProducts();
        });
    } else {
      axios
        .patch(
          "https://api.dev.myexobuy.com/stores/updateproduct/inventory/" +
            selectedProduct.COD_PRODUCTO,
          { invUpdate: invUpdate },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + document.cookie.split("=")[1]
            }
          }
        )
        .then(
          axios
            .patch(
              "https://api.dev.myexobuy.com/stores/updateproduct/price/" +
                selectedProduct.COD_PRODUCTO,
              { newPrice: price },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + document.cookie.split("=")[1]
                }
              }
            )
            .then(() => {
              handleClose();
              fetchProducts();
            })
        );
    }
  };

  //handles the closing of dialog to update a product
  const handleClose = () => {
    setOpen(false);
    setcreating(false);
    setinvUpdate("");
    setFileprod(undefined);
    setfilelabelprod("Choose a file...");
  };

  //function to render button upon submitting changes
  function RenderButton() {
    if (creating) {
      return (
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled
            style={{ width: 100 }}
          >
            Updating
          </Button>
          <CircularProgress
            size={40}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -20,
              marginLeft: -20
            }}
          />
        </div>
      );
    } else {
      return (
        <Button
          disabled={
            price === selectedProduct.COSTO_PRODUCTO && invUpdate === "" && fileprod === undefined
          }
          onClick={updateProductfetch}
          variant="contained"
          color="primary"
        >
          Update
        </Button>
      );
    }
  }

  //function to return if the change affects anyone in middle of transaction
  function returnCantidad() {
    if (selectedHold === 0) {
      return (
        <span style={{ color: "green" }}>
          {selectedProduct.CANTIDAD_ACTUAL}
        </span>
      );
    } else {
      return (
        <span style={{ color: "green" }}>
          {selectedProduct.CANTIDAD_ACTUAL}
          <span style={{ color: "orange" }}>
            {" + " + selectedHold + " items are currently in transactions"}
          </span>
        </span>
      );
    }
  }

  return (
    <React.Fragment>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle style={{ textAlign: "center" }} id="simple-dialog-title">
          Update {selectedProduct.PRODUCTO}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Stock: {returnCantidad()}</DialogContentText>

          <TextField
            disabled={creating}
            value={price}
            type="number"
            onChange={event => setPrice(event.target.value)}
            variant="outlined"
            margin="normal"
            inputProps={inputProps}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
            fullWidth
            id="precio"
            label="Precio"
          />
          <TextField
            disabled={creating}
            value={invUpdate}
            type="number"
            onChange={event => setinvUpdate(event.target.value)}
            variant="outlined"
            margin="normal"
            inputProps={invinputProps}
            fullWidth
            id="invupdate"
            label="Cambio a Inventario"
          />
          
        <input
          type="file"
          onChange={onChange}
          name="fileinprod"
          id="fileinprod"
          className={creating ? "disabled" : "inputfile"}
        />
        <label htmlFor="fileinprod">
          
          {filelabelprod}
        </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
          <RenderButton />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
