import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import "../Buy/store.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";

export default function OrderDetails(props) {
    const completeOrder = () => {
        axios
        .patch(
          "https://api.dev.myexobuy.com/orders/vendor/status",
          { order_id: props.order.ORDER_ID },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + document.cookie.split("=")[1]
            }
          }
        )
        .then(() => {
          props.fetchOrders();
          props.handleClose();
        });
    }
    return (
        <React.Fragment>
            <Dialog
                onClose={props.handleClose}
                aria-labelledby="simple-dialog-title"
                open={props.open}
            >
                <DialogTitle style={{ textAlign: "center" }} id="simple-dialog-title">
                    {"ORDEN #" + props.order.ORDER_ID}
                </DialogTitle>
                <DialogContent>

                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >PRODUCTO</TableCell>
                                <TableCell align="right">CANTIDAD</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.list.map(row => (
                                <TableRow key={row.DETAIL_ID}>
                                    <TableCell>
                                        <div style={{ display: "flex" }}>
                                            <div
                                                style={{
                                                    backgroundImage: "url('" + row.IMG_URL + "')",
                                                    height: 60,
                                                    width: 60,
                                                    backgroundSize: "cover"
                                                }}
                                            />
                                            <div style={{ paddingTop: 20, paddingLeft: 10 }}>
                                                {row.PRODUCTO}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.CANT_PRODUCTO}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} variant="contained" color="primary">
                        Close
          </Button>
                    <Button
                        onClick={completeOrder}
                        variant="contained"
                        color="primary"
                    >
                        Completar Orden
          </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
