import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditGC from './EditGC';
import EditLogo from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../Vendor/VendorList.css";

import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import CreateGC from "./CreateGC";

//sets the theme for displaying categories
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

//applies styling to components
const useStyles = makeStyles({
    table: {
        width: "100%"
    },
    paper: {
        width: 650,
        margin: "auto",
        marginTop: 50,
        paddingTop: 10
    }
});

export default function DisplayCategories(props) {
    const classes = useStyles();

    const [categoryList, setCategoryList] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [selCat, setselcat] = React.useState({});
    const [category, setCategory] = React.useState("");

    //handles the opening selecting which category is chosen
    const handleOpen = (cat) => {
        setselcat(cat);
        setCategory(cat.MERCADO);
        setOpen(true);
    };

    //handles the closing of categories
    const handleClose = () => {
        setOpen(false);
    };

    //api call to fetch all categories
    const fetchCategories = () => {
        setLoaded(false)
        axios
            .get("https://api.dev.myexobuy.com/stores/mercados")
            .then(result => {
                setCategoryList(result.data.data);
                setLoaded(true);
            });
    };

    React.useEffect(() => {
        //api call to fetch all categories
        axios
            .get("https://api.dev.myexobuy.com/stores/mercados")
            .then(result => {
                setCategoryList(result.data.data);
                setLoaded(true);
            });
    }, [props.storeID, setCategoryList]);

    if (loaded) {
        return (
            <React.Fragment>

                <ThemeProvider theme={theme}>
                    <Paper elevation={5} className={classes.paper}>
                        <h1 className="tabletitle">Categorias Globales</h1>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Category</TableCell>
                                    <TableCell align="right">Aciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categoryList.map(row => (
                                    <TableRow key={row.COD_MERCADO}>
                                        <TableCell align="center">
                                            {row.MERCADO}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                onClick={() => handleOpen(row)}
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                style={{ marginRight: 3 }}
                                                startIcon={<EditLogo />}
                                            >Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Table className={classes.table}>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">
                                        <CreateGC
                                            accessLevel={props.accessLevel}
                                            storeID={props.storeID}
                                            fetchCategories={fetchCategories}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                    <EditGC open={open} selCat={selCat} category={category} setCategory={setCategory} handleClose={handleClose} fetchCategories={fetchCategories} />
                </ThemeProvider>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <ThemeProvider theme={theme}>
                    <Paper elevation={5} className={classes.paper}>
                        <h1 className="tabletitle">Categorias Globales</h1>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Category</TableCell>
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
