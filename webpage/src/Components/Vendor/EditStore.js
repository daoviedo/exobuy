import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import SaveLogo from "@material-ui/icons/Save";
import DoneLogo from "@material-ui/icons/Done";
import CircularProgress from "@material-ui/core/CircularProgress";
import DisplayCategories from "./DisplayCategories";
import DisplayProducts from "./DisplayProducts";
import axios from 'axios';

//creates the style for the page
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

//creates the transition for when you click on a store
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const {
    open,
    accessLevel,
    selStore,
    handleClose,
    tienda,
    detalle,
    numtelf,
    direccion,
    setTienda,
    setDetalle,
    setNumtelf,
    setDireccion,
    loadingchange,
    updateStore,
    file,
    setFile,
    filelabel,
    setfilelabel,
    vendorEmail,
    setVendorEmail,
    owner,
    fetchOwner
  } = props;

  const [categoryList, setCategoryList] = React.useState([]);
  const [transferloading, settransferloading] = React.useState(false);
  
  const TransferOwner = () => {
    settransferloading(true);
    axios
      .post(
        "https://api.dev.myexobuy.com/admin/newvendor",
        {
          email: vendorEmail,
          store_id: selStore.COD_TIENDA
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1]
          }
        }
      )
      .then(() => {
        fetchOwner(selStore.COD_TIENDA)
        setVendorEmail("");
        settransferloading(false);
      });
  };

  //function that handles the change of a file for store picture
  const onChange = (e) => {
    setFile(e.target.files[0]);
    try {
      setfilelabel(e.target.files[0].name);
    } catch {
      setfilelabel("Choose a file...");
    }
  };

  //function that returns the button depending on if change is occuring
  function ReturnButton() {
    if (loadingchange) {
      return (
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled
            style={{ width: 100 }}
          >
            Saving
          </Button>
          <CircularProgress
            size={24}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -8,
              marginLeft: -12,
            }}
          />
        </div>
      );
    } else {
      if (
        tienda !== selStore.TIENDA ||
        detalle !== selStore.TIENDA_DETALLE ||
        numtelf !== selStore.NUM_TELF ||
        direccion !== selStore.DIRECCION_FISICA ||
        file !== undefined
      ) {
        return (
          <Button
            onClick={() => updateStore(selStore.COD_TIENDA)}
            variant="contained"
            color="primary"
            style={{ width: 100 }}
            endIcon={<SaveLogo />}
          >
            Save
          </Button>
        );
      } else {
        return (
          <Button
            variant="contained"
            color="primary"
            style={{ width: 100 }}
            endIcon={<DoneLogo />}
            disabled
          >
            Saved
          </Button>
        );
      }
    }
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {selStore.TIENDA}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <div
          style={{
            marginTop: 15,
            marginRight: 10,
            backgroundImage: "url('" + selStore.IMG_URL + "')",
            height: 350,
            width: 350,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 10,
            border: "2px solid #06A66A",
          }}
        />
        <div style={{ width: 500 }}>
          <TextField
            value={tienda}
            onChange={(event) => setTienda(event.target.value)}
            disabled={loadingchange || accessLevel !== 5}
            variant="outlined"
            margin="normal"
            fullWidth
            id="tienda"
            label="Tienda"
          />
          <TextField
            value={detalle}
            onChange={(event) => setDetalle(event.target.value)}
            disabled={loadingchange || accessLevel !== 5}
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows="4"
            id="detalle"
            label="Detalle De Tienda"
          />
          <TextField
            value={direccion}
            onChange={(event) => setDireccion(event.target.value)}
            disabled={loadingchange || accessLevel !== 5}
            variant="outlined"
            margin="normal"
            fullWidth
            id="direccion"
            label="Direccion"
          />
          <TextField
            value={numtelf}
            onChange={(event) => setNumtelf(event.target.value)}
            disabled={loadingchange || accessLevel !== 5}
            variant="outlined"
            margin="normal"
            fullWidth
            id="telefono"
            label="Num. de Telefono"
          />
        </div>
      </div>
      {accessLevel === 5 ? (<div
        style={{
          fontFamily: '"Montserrat", sans-serif',
          marginTop: 20,
          marginBottom: 10,
          textAlign: "center",
        }}
      >

        <div>
          Logo (.png/.jpeg 5MB max)
        <input
            type="file"
            onChange={onChange}
            name="filein"
            id="filein"
            className={loadingchange || accessLevel !== 5 ? "disabled" : "inputfile"}
          />
          <label htmlFor="filein">

            {filelabel}
          </label>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 300, margin: 'auto', marginTop: 20 }}>
            {"Current: " + owner}
            <TextField
              value={vendorEmail}
              onChange={(event) => setVendorEmail(event.target.value)}
              disabled={loadingchange || accessLevel !== 5}
              variant="outlined"
              margin="normal"
              fullWidth
              id="correo"
              label="Vendor Email"
            />
            <Button
              onClick={TransferOwner}
              variant="contained"
              color="primary"
              style={{ marginBottom: 20 }}
              disabled={vendorEmail === "" || transferloading}
            >
              Transfer Ownership
          </Button>

          </div>

          <ReturnButton />
        </div>

      </div>) : (<div />)}

      <Divider style={{ marginTop: 10 }} />
      <DisplayCategories
        categoryList={categoryList}
        setCategoryList={setCategoryList}
        storeID={selStore.COD_TIENDA}
        accessLevel={accessLevel}
      />
      <DisplayProducts
        storeID={selStore.COD_TIENDA}
        categorylist={categoryList}
        accessLevel={accessLevel}
      />
    </Dialog>
  );
}
