import React from "react";
import { Route, Redirect, BrowserRouter, Switch } from "react-router-dom";
import Activate from "./Components/Account/Activate";
import Login from "./Components/Account/Login";
import Home from "./Containers/Home/Home";
import Register from "./Components/Account/Register";
import Resend from "./Components/Account/Resend";
import NavigationBar from "./Containers/Navbar/NavigationBar";
import Cart from "./Components/Cart/Cart";

import axios from "axios";
import Buy from "./Components/Buy/Buy";
import Store from "./Components/Buy/Store";
import Admin from "./Components/Admin/Admin";
import Account from "./Components/Account/Account";
import Vendor from "./Components/Vendor/Vendor";
import Delivery from "./Components/Delivery/Delivery";
import Notfound from "./Containers/Notfound/Notfound";
import Terms from "./Components/Account/Terms";
import Orders from "./Components/Orders/Orders";

function App() {
  const [loaded, changeLoaded] = React.useState(false);
  const [cartloaded, changecartLoaded] = React.useState(false);

  const [accessLevel, setAccess] = React.useState(2);
  const [isLogged, changeLogged] = React.useState(false);
  const [cartcount, setcc] = React.useState(0);
  const token = document.cookie.split("=")[1];

  React.useEffect(() => {
    const checkLogged = () => {
      if (token === undefined || token === "") {
        changeLoaded(true);
        changecartLoaded(true);
      } else {
        //verifies if user is logged in with correct token
        axios
          .get("https://api.dev.myexobuy.com/verify/token", {
            headers: {
              Authorization: "Bearer " + document.cookie.split("=")[1]
            }
          })
          .then(result => {
            changeLogged(result.data.authentication);
            setAccess(result.data.access);
            changeLoaded(true);
          });
        //api call to fetch cart to send to navbar
        axios
          .get("https://api.dev.myexobuy.com/cart/itemcount", {
            headers: {
              Authorization: "Bearer " + document.cookie.split("=")[1]
            }
          })
          .then(result => {
            if (result.data.itemcount === null) {
              setcc(0);
              changecartLoaded(true);
            } else {
              setcc(parseInt(result.data.itemcount));
              changecartLoaded(true);
            }
          });
      }
    };
    checkLogged();
  }, [token]);

  //api call to fetch item count when cart is updated
  const refetchItemCount = () => {
    axios
      .get("https://api.dev.myexobuy.com/cart/itemcount", {
        headers: {
          Authorization: "Bearer " + document.cookie.split("=")[1]
        }
      })
      .then(result => {
        if (result.data.itemcount === null) {
          setcc(0);
        } else {
          setcc(parseInt(result.data.itemcount));
        }
      });
  };

  if (loaded && cartloaded) {
    return (
      <BrowserRouter>
        <NavigationBar
          access={accessLevel}
          itemcount={cartcount}
          isLogged={isLogged}
        />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/activate" exact component={Activate} />
          <Route path="/buy" exact component={Buy} />
          <Route path="/terms" exact component={Terms} />
          <Route
            path="/store"
            exact
            render={props => (
              <Store
                {...props}
                isLogged={isLogged}
                refcartitems={refetchItemCount}
              />
            )}
          />

          <Route path="/login" exact>
            {isLogged ? <Redirect to="/" /> : <Login />}
          </Route>
          <Route path="/register" exact>
            {isLogged ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route path="/resend" exact>
            {isLogged ? <Redirect to="/" /> : <Resend />}
          </Route>

          <Route path="/cart" exact>
            {isLogged ? (
              <Cart />
            ) : (
              <Redirect to={{ pathname: "/login", state: { from: "/cart" } }} />
            )}
          </Route>
          <Route path="/account" exact>
            {isLogged ? (
              <Account />
            ) : (
              <Redirect
                to={{ pathname: "/login", state: { from: "/account" } }}
              />
            )}
          </Route>

          <Route path="/admin" exact>
            {accessLevel === 1 || accessLevel === 5 ? <Admin /> : <Notfound />}
          </Route>
          <Route path="/vendor" exact>
            {accessLevel === 3 || accessLevel === 5 ? <Vendor accessLevel={accessLevel}/> : <Notfound />}
          </Route>
          <Route
            path="/orders"
            exact
            render={props => (
              <Orders
                {...props}
                isLogged={isLogged}
                accessLevel={accessLevel}
              />
            )}
          />
          <Route path="/delivery" exact>
            {accessLevel === 4 || accessLevel === 5 ? (
              <Delivery />
            ) : (
              <Notfound />
            )}
          </Route>

          <Route component={Notfound} />
        </Switch>
      </BrowserRouter>
    );
  } else {
    return <React.Fragment />;
  }
}

export default App;
