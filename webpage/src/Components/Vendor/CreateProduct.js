import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import "../Buy/store.css";
import "./styling.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { TextField } from "@material-ui/core";
import Publish from "@material-ui/icons/Publish";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";

const inputProps = {
  min: 1
};

export default function CreateProduct(props) {
  const [open, setOpen] = React.useState(false);

  const [producto, setProducto] = React.useState("");
  const [costo, setcosto] = React.useState("");
  const [peso, setpeso] = React.useState("");
  const [cantidad, setCantidad] = React.useState("");
  const [catID, setcatid] = React.useState("");
  const [barcode, setbarcode] = React.useState("");
  const [detalle, setDetalle] = React.useState("");

  const [file, setFile] = React.useState(undefined);
  const [filelabel, setfilelabel] = React.useState("Choose a file...");

  const [creating, setcreating] = React.useState(false);

  //function that handles the product image and changing the image selected
  const onChange = e => {
    setFile(e.target.files[0]);
    try {
      setfilelabel(e.target.files[0].name);
    } catch {
      setfilelabel("Choose a file...");
    }
  };

  //handles the opening of the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  //handles the closing of the dialog, resets variables back to default after closing
  const handleClose = () => {
    setOpen(false);
    setcreating(false);
    setProducto("");
    setcosto("");
    setpeso("");
    setCantidad("");
    setcatid("");
    setbarcode("");
    setDetalle("");
    setFile(undefined);
    setfilelabel("Choose a file...");
  };

  //api call to create a new product
  const createProductapi = () => {
    setcreating(true);
    let bodyFormData = new FormData();
    bodyFormData.set("producto", producto);
    bodyFormData.set("cod_tienda", props.storeID);
    bodyFormData.set("costo_producto", costo);
    bodyFormData.set("peso_producto", peso);
    bodyFormData.set("cantidad", cantidad);
    bodyFormData.set("cod_categoria_producto", catID);
    bodyFormData.set("cod_barra", barcode);
    bodyFormData.set("detalle", detalle);
    bodyFormData.append("productImage", file);
    axios
      .post("https://api.dev.myexobuy.com/stores/products", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + document.cookie.split("=")[1]
        }
      })
      .then(() => {
        handleClose();
        props.fetchProducts();
      });
  };

  //function that renders the button depending on if its in process of creating
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
            Creating
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
            producto === "" ||
            detalle === "" ||
            costo === "" ||
            cantidad === "" ||
            catID === ""
          }
          onClick={createProductapi}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      );
    }
  }

  return (
    <React.Fragment>
      <Button disabled={props.accessLevel !== 5} variant="contained" color="primary" onClick={handleOpen}>
        Create New Product
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle style={{ textAlign: "center" }} id="simple-dialog-title">
          Create New Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          Crea un nuevo producto para su tienda.
          </DialogContentText>
          <div style={{ textAlign: "center" }}>
            <TextField
              disabled={creating}
              onChange={event => setcatid(event.target.value)}
              style={{ width: 250, margin: "auto" }}
              select
              required
              label="Categoria De Producto"
              value={catID}
            >
              {props.categorylist.map(cat => (
                <MenuItem
                  key={cat.COD_CATEGORIA_PRODUCTO}
                  value={cat.COD_CATEGORIA_PRODUCTO}
                >
                  {cat.CATEGORIA_PRODUCTO}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <TextField
            disabled={creating}
            value={producto}
            onChange={event => setProducto(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            id="producto"
            label="Producto"
          />
          <TextField
            disabled={creating}
            value={detalle}
            onChange={event => setDetalle(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows="4"
            id="detalle"
            label="Detalle De Producto"
          />
          <div style={{ display: "flex" }}>
            <TextField
              style={{ paddingRight: 5 }}
              disabled={creating}
              value={costo}
              type="number"
              onChange={event => setcosto(event.target.value)}
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
              style={{ paddingRight: 5, paddingLeft: 5 }}
              disabled={creating}
              value={cantidad}
              type="number"
              onChange={event => setCantidad(event.target.value)}
              variant="outlined"
              margin="normal"
              inputProps={inputProps}
              fullWidth
              id="cantidad"
              label="Cantidad"
            />
            <TextField
              style={{ paddingLeft: 5 }}
              disabled={creating}
              value={peso}
              type="number"
              onChange={event => setpeso(event.target.value)}
              variant="outlined"
              margin="normal"
              inputProps={inputProps}
              InputProps={{
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }}
              fullWidth
              id="peso"
              label="Peso"
            />
          </div>

          <TextField
            disabled={creating}
            value={barcode}
            onChange={event => setbarcode(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            id="barcode"
            label="Num. de Barra"
          />
          <div
            style={{
              fontFamily: '"Montserrat", sans-serif',
              marginTop: 20,
              marginBottom: 10,
              textAlign: "center"
            }}
          >
            Foto de Producto (.png/.jpeg 5MB max)
            <input
              type="file"
              onChange={onChange}
              name="fileinp"
              id="fileinp"
              className={creating ? "disabled" : "inputfile"}
            />
            <label htmlFor="fileinp">
              <Publish
                style={{ fontSize: 22, marginBottom: 3, marginRight: 3 }}
              />
              {filelabel}
            </label>
          </div>
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
