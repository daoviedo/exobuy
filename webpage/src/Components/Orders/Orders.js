import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Vendor/VendorList.css';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import OrderDetails from './OrderDetails';

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
        width: 950,
        margin: "auto",
        marginTop: 50,
        paddingTop: 10
    }
});

export default function Orders(props) {
    const classes = useStyles();
    const [orders, setOrders] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [list, setList] = React.useState([]);
    const [selectedOrder, setSelectedOrder] = React.useState({});

    React.useEffect(() => {
        const values = queryString.parse(props.location.search);
        //checks to see if id is actually defined, is needed to search correctly
        if (values.id === undefined || values.id === '') {

        }
        else {
            axios.get('https://api.dev.myexobuy.com/orders/orderlist/' + values.id, {
                headers: {
                    'Authorization': 'Bearer ' + document.cookie.split('=')[1]
                }
            })
                .then(result => setOrders(result.data.data))
        }

    }, [props]);

    const fetchOrders = () => {
        const values = queryString.parse(props.location.search);
        axios.get('https://api.dev.myexobuy.com/orders/orderlist/' + values.id, {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.split('=')[1]
            }
        })
            .then(result => setOrders(result.data.data))
    }

    const fetchOrder = (cart) => {
        const values = queryString.parse(props.location.search);

        axios.get('https://api.dev.myexobuy.com/orders/orderdetails/' + values.id + '/' + cart, {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.split('=')[1]
            }
        })
            .then(result => { setList(result.data.data); setOpen(true) })
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = (row) => {
        setSelectedOrder(row);
        fetchOrder(row.CART_ID);
    };
    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Paper elevation={5} className={classes.paper}>
                    <h1 className="tabletitle">Ordenes</h1>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >ORDER ID</TableCell>
                                <TableCell align="right">DATE/TIME</TableCell>
                                <TableCell align="right">STATUS</TableCell>
                                <TableCell align="right">ITEM COUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map(row => (
                                <TableRow key={row.ORDER_ID} onClick={() => handleOpen(row)}>
                                    <TableCell>
                                        {row.ORDER_ID}
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Date(row.TIME_ORDERED).toString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.STATUS}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.ITEMCOUNT}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <OrderDetails open={open} list={list} handleClose={handleClose} fetchOrders={fetchOrders} order={selectedOrder} />
            </ThemeProvider>
        </React.Fragment>
    );
}