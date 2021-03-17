import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditLogo from "@material-ui/icons/Edit";
import OrderLogo from "@material-ui/icons/ListAlt";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditStore from "./EditStore";
import Switch from '@material-ui/core/Switch';
import "./VendorList.css";

import { createMuiTheme, ThemeProvider, Button } from "@material-ui/core";
import CreateStore from "./CreateStore";

//creates the theme for the page
const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: 1,
      },
      head: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontSize: "1rem",
      },
      body: {
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: 0,
        fontSize: "0.9rem",
      },
    },
  },
  palette: {
    primary: { main: "#06A66A" },
  },
});

//creates the styles for the elements
const useStyles = makeStyles({
  table: {
    width: "100%",
  },
  paper: {
    width: 950,
    margin: "auto",
    marginTop: 150,
    paddingTop: 10,
  },
});

export default function VendorList(props) {
  const classes = useStyles();
  const [storeslist, setstorelist] = React.useState([]);
  const [loaded, setloaded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [vendorEmail, setVendorEmail] = React.useState("");
  const [selStore, setSelStore] = React.useState({});
  const [tienda, setTienda] = React.useState("");
  const [detalle, setDetalle] = React.useState("");
  const [numtelf, setNumtelf] = React.useState("");
  const [direccion, setDireccion] = React.useState("");
  const [file, setFile] = React.useState(undefined);
  const [filelabel, setfilelabel] = React.useState("Choose a file...");
  const [owner, setOwner] = React.useState("");
  const [loadingchange, setloadingchange] = React.useState(false);

  //api call to update a store info and checks if they changed picture
  const updateStore = (cod_tienda) => {
    setloadingchange(true);
    if (file === undefined) {
      axios
        .patch(
          "https://api.dev.myexobuy.com/stores/vendor",
          {
            cod_tienda: cod_tienda,
            tienda: tienda,
            direccion: direccion,
            tienda_detalle: detalle,
            num_telf: numtelf,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + document.cookie.split("=")[1],
            },
          }
        )
        .then(() => fetchStore(cod_tienda));
    } else {
      let bodyFormData = new FormData();
      bodyFormData.set("cod_tienda", cod_tienda);
      bodyFormData.set("tienda", tienda);
      bodyFormData.set("direccion", direccion);
      bodyFormData.set("tienda_detalle", detalle);
      bodyFormData.set("num_telf", numtelf);
      bodyFormData.append("productImage", file);
      axios
        .patch("https://api.dev.myexobuy.com/stores/vendorimg", bodyFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + document.cookie.split("=")[1],
          },
        })
        .then(() => {fetchStore(cod_tienda); setFile(undefined); setfilelabel("Choose a file...")});
    }
  };

  //api call to fetch store info of selected store
  const fetchStore = (cod_tienda) => {
    axios
      .get("https://api.dev.myexobuy.com/stores/details/" + cod_tienda)
      .then((result) => {
        setSelStore(result.data.data[0]);
        setloadingchange(false);
        fetchStoreList();
      });
  };

  const fetchOwner = (store_id) => {
    axios
      .get("https://api.dev.myexobuy.com/admin/currentowner/" + store_id, {
        headers: {
          Authorization: "Bearer " + document.cookie.split("=")[1],
        },
      })
      .then((result) => {
        setOwner(result.data.data);
        setloadingchange(false);
        fetchStoreList();
      });
  };

  //api call to get all stores of vendor
  const fetchStoreList = () => {
    axios
      .get("https://api.dev.myexobuy.com/stores/vendor", {
        headers: {
          Authorization: "Bearer " + document.cookie.split("=")[1],
        },
      })
      .then((result) => {
        setstorelist(result.data.data);
      });
  };

  React.useEffect(() => {
    axios
      .get("https://api.dev.myexobuy.com/stores/vendor", {
        headers: {
          Authorization: "Bearer " + document.cookie.split("=")[1],
        },
      })
      .then((result) => {
        setstorelist(result.data.data);
        setloaded(true);
      });
  }, []);

  //handles opening of store modification
  const handleClickOpen = (store) => {
    if(props.accessLevel === 5){
      fetchOwner(store.COD_TIENDA);
    }
    setSelStore(store);
    setTienda(store.TIENDA);
    setDetalle(store.TIENDA_DETALLE);
    setNumtelf(store.NUM_TELF);
    setDireccion(store.DIRECCION_FISICA);
    setFile(undefined);
    setfilelabel("Choose a file...");
    setOpen(true);
  };

  const changeStatus = (store, value) => {
    let newval;
    if(value){
      newval = 1
    }
    else{
      newval = 0
    }
    axios
        .patch("https://api.dev.myexobuy.com/stores/disable/store", {cod_tienda: store, newActive: newval}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1],
          },
        })
        .then(fetchStoreList);
  };

  //handles closing of store modification
  const handleClose = () => {
    setOpen(false);
  };

  //returns marketcode
  function returnMarket(marketcode) {
    switch (marketcode) {
      case 1:
        return "Markets";
      case 2:
        return "Licores";
      case 3:
        return "Dulces Varios";
      default:
        return "UNIDENTIFIED";
    }
  }

  if (loaded) {
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Paper elevation={10} className={classes.paper}>
            <h1 className="tabletitle">My Stores</h1>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tablecell">Tienda</TableCell>
                  <TableCell align="right">Tipo Mercado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                  <TableCell align="right">Activo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {storeslist.map((row) => (
                  <TableRow key={row.COD_TIENDA}>
                    <TableCell component="th" scope="row">
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            backgroundImage: "url('" + row.IMG_URL + "')",
                            height: 60,
                            width: 60,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <div className="bodytext">{row.TIENDA}</div>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {returnMarket(row.COD_MERCADO)}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleClickOpen(row)}
                        size="small"
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 3 }}
                        startIcon={<EditLogo />}
                      >
                        Edit
                      </Button>
                      <Button
                        href={"/orders?id=" + row.COD_TIENDA}
                        size="small"
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 3 }}
                        startIcon={<OrderLogo />}
                      >
                        Orders
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                    <Switch color="primary"
                      name="checkedA"
                      checked={row.ACTIVO===1}
                      onChange={(event) => changeStatus(row.COD_TIENDA, event.target.checked)}
                    />
                      
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <CreateStore accessLevel={props.accessLevel} fetchStoreList={fetchStoreList} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
          <EditStore
            open={open}
            accessLevel={props.accessLevel}
            selStore={selStore}
            handleClose={handleClose}
            tienda={tienda}
            detalle={detalle}
            numtelf={numtelf}
            direccion={direccion}
            setTienda={setTienda}
            setDetalle={setDetalle}
            setNumtelf={setNumtelf}
            setDireccion={setDireccion}
            updateStore={updateStore}
            loadingchange={loadingchange}
            file={file}
            filelabel={filelabel}
            setfilelabel={setfilelabel}
            setFile={setFile}
            vendorEmail={vendorEmail}
            setVendorEmail={setVendorEmail}
            owner={owner}
            fetchOwner={fetchOwner}
          />
        </ThemeProvider>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Paper elevation={10} className={classes.paper}>
            <h1 className="tabletitle">My Stores</h1>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tablecell">Tienda</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
            </Table>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <CircularProgress style={{ margin: "auto" }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
