import React from 'react';
import './nav.css';
import Logo from './LOGO.png';

import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import NavComponent from './NavComponent';

const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️
    MuiBadge: {
      // Name of the rule
      badge: {
        marginTop: -4,
        width: 20,
        fontSize: '0.7rem',
        padding: '0 0px',
        paddingLeft: 2,
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: 1
      },
    },
  },
  palette: {
    primary: {main: '#06A66A'},
  }
});

export default function NavigationBar(props) {
    return (
        <div className="navwrapper">
        <div className="cont">
            <img className="logonav" src={Logo} alt="logonav" />
            <nav>
                <ul className="nav__links">
                <ThemeProvider theme={theme}>
                    <NavComponent access={props.access} itemcount={props.itemcount} isLogged={props.isLogged} />
                </ThemeProvider>
                </ul>
            </nav>
        </div>
        </div>
    );
}