import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles({
  root: {
    width: 250,
    height: 333
  }
});

export default function DisplayStores(props) {
  const classes = useStyles();
  console.log(props.stores)
  return (
    <div style={{ width: 900, display: "inline-block" }}>
      <Grid container>
        {props.stores.map(store => (
          <Grid
            key={store.COD_TIENDA}
            style={{ marginTop: 20, marginBottom: 20 }}
            item
            xs
          >
            <Link
              href={"/store?id=" + store.COD_TIENDA}
              style={{ textDecoration: "none" }}
            >
              <Card
                elevation={6}
                style={{ margin: "auto" }}
                className={classes.root}
              >
                <CardActionArea style={{}}>
                  <CardMedia
                    component="img"
                    alt="filler info"
                    style={{
                      margin: "auto",
                      height: 150,
                      width: "auto",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                    image={store.IMG_URL}
                    title="filler info"
                  />
                  <CardContent
                    style={{
                      height: 183,
                      background:
                        "linear-gradient(to bottom, rgb(3,146,93), rgb(8,178,115))"
                    }}
                  >
                    <Typography
                      style={{ color: "white" }}
                      gutterBottom
                      variant="h6"
                    >
                      {store.TIENDA}
                    </Typography>
                    <Typography
                      style={{ color: "#DCDCDC" }}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {store.TIENDA_DETALLE}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
