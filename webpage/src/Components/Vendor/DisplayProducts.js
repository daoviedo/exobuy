import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./VendorList.css";
import EditLogo from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import UpdateProduct from "./UpdateProduct";
import Switch from '@material-ui/core/Switch';


import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import CreateProduct from "./CreateProduct";

//creates the theme for the page
const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: 1
      },
      head: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontSize: "1rem"
      },
      body: {
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: 0,
        fontSize: "0.9rem"
      }
    }
  },
  palette: {
    primary: { main: "#06A66A" }
  }
});

//creates the styling for components
const useStyles = makeStyles({
  table: {
    width: "100%"
  },
  paper: {
    width: 1150,
    margin: "auto",
    marginTop: 50,
    paddingTop: 10,
    marginBottom: 100
  }
});

export default function DisplayProducts(props) {
  const classes = useStyles();

  const [productList, setProductList] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setselectedProduct] = React.useState({});
  const [selectedHold, setselectedHold] = React.useState(0);
  const [price, setPrice] = React.useState("");
  const [fileprod, setFileprod] = React.useState(undefined);
  const [filelabelprod, setfilelabelprod] = React.useState("Choose a file...");

  //api call to fetch products
  const fetchProducts = () => {
    axios
      .get("https://api.dev.myexobuy.com/stores/products/" + props.storeID)
      .then(result => {
        setProductList(result.data.data);
      });
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
        .patch("https://api.dev.myexobuy.com/stores/disable/product", {cod_producto: store, newActive: newval}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1],
          },
        })
        .then(fetchProducts);
  };

  //api call to check if item is in middle of transaction before modifying
  const handleModify = item => {
    setselectedProduct(item);
    setPrice(item.COSTO_PRODUCTO);
    setOpen(true);
    axios
      .get(
        "https://api.dev.myexobuy.com/stores/productfinder/inventoryhold/" +
          item.COD_PRODUCTO,
        {
          headers: {
            Authorization: "Bearer " + document.cookie.split("=")[1]
          }
        }
      )
      .then(result => {
        setselectedHold(result.data.value);
      });
  };

  React.useEffect(() => {
    //api call to get all products for that store
    axios
      .get("https://api.dev.myexobuy.com/stores/products/" + props.storeID)
      .then(result => {
        setProductList(result.data.data);
        setLoaded(true);
      });
  }, [props.storeID]);

  if (loaded) {
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Paper elevation={5} className={classes.paper}>
            <h1 className="tabletitle">Productos</h1>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Categoria</TableCell>
                  <TableCell align="right">Codigo Barra</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                  <TableCell align="right">Activo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.map(row => (
                  <TableRow key={row.COD_PRODUCTO}>
                    <TableCell component="th" scope="row">
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            backgroundImage: "url('" + row.IMG_URL + "')",
                            height: 60,
                            width: 60,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                          }}
                        />
                        <div className="bodytext2">{row.PRODUCTO}</div>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {row.COD_CATEGORIA_PRODUCTO}
                    </TableCell>
                    <TableCell align="right">{row.COD_BARRA}</TableCell>
                    <TableCell align="right">{row.COSTO_PRODUCTO}</TableCell>
                    <TableCell align="right">{row.CANTIDAD_ACTUAL}</TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleModify(row)}
                        size="small"
                        disabled={props.accessLevel !== 5}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 3 }}
                        startIcon={<EditLogo />}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                    <Switch color="primary"
                      name="checkedA"
                      checked={row.ACTIVO===1}
                      onChange={(event) => changeStatus(row.COD_PRODUCTO, event.target.checked)}
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
                    <CreateProduct
                      accessLevel={props.accessLevel}
                      fetchProducts={fetchProducts}
                      storeID={props.storeID}
                      categorylist={props.categorylist}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
          <UpdateProduct
            open={open}
            setOpen={setOpen}
            selectedProduct={selectedProduct}
            selectedHold={selectedHold}
            price={price}
            setPrice={setPrice}
            fetchProducts={fetchProducts}
            fileprod={fileprod}
            filelabelprod={filelabelprod}
            setfilelabelprod={setfilelabelprod}
            setFileprod={setFileprod}
          />
        </ThemeProvider>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Paper elevation={5} className={classes.paper}>
            <h1 className="tabletitle">Categorias de Productos</h1>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Categoria</TableCell>
                  <TableCell align="right">Codigo Barra</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
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
