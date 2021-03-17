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

export default function CreateStore(props) {
  const [open, setOpen] = React.useState(false);
  const [mercadolist, setMercadolist] = React.useState([]);
  const [mercado, setMercado] = React.useState("");
  const [tienda, setTienda] = React.useState("");
  const [detalle, setDetalle] = React.useState("");
  const [direccion, setDireccion] = React.useState("");
  const [numtelf, setNumtelf] = React.useState("");
  const [paypal_email, setPaypalEmail] = React.useState("");

  const [file, setFile] = React.useState(undefined);
  const [filelabel, setfilelabel] = React.useState("Choose a file...");

  const [creating, setcreating] = React.useState(false);

  //function that handles image file change
  const onChange = e => {
    setFile(e.target.files[0]);
    try {
      setfilelabel(e.target.files[0].name);
    } catch {
      setfilelabel("Choose a file...");
    }
  };

  React.useEffect(() => {
    //api call to get all mercados
    axios
      .get("https://api.dev.myexobuy.com/stores/mercados")
      .then(result => setMercadolist(result.data.data));
  }, []);

  //api call to open dialog
  const handleOpen = () => {
    setOpen(true);
  };
  //api call to close dialog and reset variables back to default
  const handleClose = () => {
    setOpen(false);
    setcreating(false);
    setMercado("");
    setTienda("");
    setDetalle("");
    setDireccion("");
    setNumtelf("");
    setFile(undefined);
    setfilelabel("Choose a file...");
    setPaypalEmail("");
  };

  //api call to create a store
  const createStore = () => {
    setcreating(true);
    let bodyFormData = new FormData();
    bodyFormData.set("nombre_tienda", tienda);
    bodyFormData.set("cod_mercado", mercado);
    bodyFormData.set("direccion", direccion);
    bodyFormData.set("detalle", detalle);
    bodyFormData.set("num_telf", numtelf);
    bodyFormData.set("paypal_email", paypal_email);
    bodyFormData.append("productImage", file);
    axios
      .post("https://api.dev.myexobuy.com/stores/create", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + document.cookie.split("=")[1]
        }
      })
      .then(() => {
        handleClose();
        props.fetchStoreList();
      });
  };

  //function that renders button on creating
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
            mercado === "" ||
            tienda === "" ||
            detalle === "" ||
            direccion === "" ||
            numtelf === ""
          }
          onClick={createStore}
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
        Create New store
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle style={{ textAlign: "center" }} id="simple-dialog-title">
          Create New Store
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Notifíquenos cuando cree una tienda para que podamos actualizar su
            logo.
          </DialogContentText>
          <div style={{ textAlign: "center" }}>
            <TextField
              disabled={creating}
              onChange={event => setMercado(event.target.value)}
              style={{ width: 175, margin: "auto" }}
              select
              required
              label="Categoria Global"
              value={mercado}
            >
              {mercadolist.map(cat => (
                <MenuItem key={cat.COD_MERCADO} value={cat.COD_MERCADO}>
                  {cat.MERCADO}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <TextField
            disabled={creating}
            value={tienda}
            onChange={event => setTienda(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            id="tienda"
            label="Tienda"
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
            label="Detalle De Tienda"
          />
          <TextField
            disabled={creating}
            value={direccion}
            onChange={event => setDireccion(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            id="direccion"
            label="Direccion"
          />
          <TextField
            disabled={creating}
            value={numtelf}
            onChange={event => setNumtelf(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            id="telefono"
            label="Num. de Telefono"
          />
          <TextField
            disabled={creating}
            value={paypal_email}
            onChange={event => setPaypalEmail(event.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            id="paypal"
            label="Correo de Paypal"
          />
          <div
            style={{
              fontFamily: '"Montserrat", sans-serif',
              marginTop: 20,
              marginBottom: 10,
              textAlign: "center"
            }}
          >
            Logo (.png/.jpeg 5MB max)
            <input
              type="file"
              onChange={onChange}
              name="filein"
              id="filein"
              className={creating ? "disabled" : "inputfile"}
            />
            <label htmlFor="filein">
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
