import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {useHistory} from 'react-router-dom';

const theme1 = createMuiTheme({
  palette: {
    primary: {main: '#06A66A'},
  },
  typography: {
    fontFamily: 'Montserrat'
  }
});

//function that displays info on bottom, just design
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://api.dev.myexobuy.com">
        MY EXO | BUY
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

//sets the styles for the page elements
const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme1.palette.primary.main,
  },
  form: {
    width: '85%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 3),
  },
  back: {
    width: '100%',
    minHeight: '100vh',
    height: '100%',
    background: 'linear-gradient(to bottom, rgb(3,146,93), rgb(8,178,115))'
  }
}));

export default function Login(props) {
  const classes = useStyles();
  const [email, changeEmail] = React.useState("");
  const [password, changePassword] = React.useState("");
  const [loginOutput, setLoginOutput] = React.useState({});
  const [activated, setAct] = React.useState(0);
  const [timer, setTimer] = React.useState(false);

  let history = useHistory();
  console.log(history);
  React.useEffect(() => {
  }, [])

  //api call to login with credentials
  const requestLogin = () => {
        axios.post('https://api.dev.myexobuy.com/account/login', {
          email: email,
          password: password
        }, {
          headers: {
            "Content-Type": "application/json",
          }
        })
        .then(result => {setLoginOutput(result.data); checkActivation(result.data.token);})
        .catch(err => {setLoginOutput(err.response.data); openResponse()})
  }

  //api call to check if email has been activated
  const checkActivation = (token) => {
    axios.get('https://api.dev.myexobuy.com/verify/email', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ token
      }
    })
    .then(result => {setAct(parseInt(result.data.active)); openResponse()})
    .catch(err => console.log(err))
}

  //this opens the output of the login attempt set to 2 secs
  function openResponse(){
      setTimer(true);
      setTimeout(() => {
        setTimer(false);
    }, 2000);  
  }

  //function that sets the cookie to save login, expiration set to 2 weeks
  function setcookie(cookieName, cookieValue) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000*24*14);
    document.cookie = cookieName+"="+cookieValue + ";expires="+expire.toGMTString();
}

  //function to display output depending on credential input
  function DisplayOutput() {
      if(timer){
        if(loginOutput.statusCode === 0){
            return <Typography color="error">Invalid Credentials</Typography>
        }
        else if(loginOutput.statusCode === 1){

          //first checks if email active
          if (activated === 1){
            setcookie('token', loginOutput.token);
            //check if location came from undefined source not exobuy
            if(history.location.state === undefined){
                window.location.replace('/');
            }
            else{
              //returns them back to where they came from
              window.location.replace(history.location.state.from);
            }
            
            
            return <div/>
          }
          else{
            return <Typography color="error">Please Activate your Email!</Typography>
          }
            
        }
        else{
            return <Typography color="error">Something Went Wrong!</Typography>
        }
      }
      else{
          return <div/>
      }
  }

  return (
    <div className={classes.back}>
      <div style={{height: 150}}/>
      <Paper elevation={4} style={{margin: 'auto', width: 450, paddingTop: 40, paddingBottom: 40}}>
    <Container component="main" maxWidth="xs">
      <ThemeProvider theme={theme1}>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon style={{}}/>
        </Avatar>
        <Typography style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 600}} component="h1" variant="h5">
          LOGIN
        </Typography>
        <div className={classes.form}>
          <TextField
            value={email}
            onChange={event => changeEmail(event.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            value={password}
            onChange={event => changePassword(event.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          
          <DisplayOutput />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
          style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 600}}
            onClick={() => requestLogin()}
            disabled={email === "" || password === ""}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <div style={{textAlign: 'center', marginTop: 10}}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              </div>
          
        <div style={{textAlign: 'center', marginTop: 10}}>
          <Link href="/resend" variant="body2">
                {"Resend email verification"}
              </Link>
              </div>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      </ThemeProvider>
    </Container>
    </Paper>
    </div>
  );
}