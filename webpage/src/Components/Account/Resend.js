import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios';

//displays copyright info
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

//makes the styles of the components
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [email, changeEmail] = React.useState("");
  const [response, changeResonse] = React.useState({});
  const [isLoading, changeLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(false);

  //api call to resend email verification
  const requestResend = () => {
    changeLoading(true);
    axios.get('https://api.dev.myexobuy.com/account/resend?email=' + email, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(result => {changeResonse(result.data); changeLoading(false); openResponse()})
    .catch(err => console.log(err))
}

//function that opens response
function openResponse(){
    changeEmail("")
    setTimer(true);
    setTimeout(() => {
        setTimer(false);
    }, 2500);  
}

//function that displays the output
function DisplayOutput() {
    if(isLoading){
        return <div style={{textAlign: 'center'}}>
                <CircularProgress />
                </div>
    }
    else if(timer){
        if(response.statusCode === 1){
        return <Typography variant="h6" align="center" style={{color: "green"}}><DoneIcon />{response.message}</Typography>
        }
        else{
            return <Typography variant="h6" align="center" color="error"><ErrorIcon />{response.message}</Typography>
        }
    }
    else{
        return <Button
        onClick={() => requestResend()}
        disabled={email === ""}
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Resend
      </Button>
    }
}

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resend Email Verification
        </Typography>
        <div className={classes.form}>
          <TextField
            disabled={isLoading}
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
          <DisplayOutput />
        <div style={{textAlign: 'center', marginTop: 10}}>
          <Link href="/login" variant="body2">
                {"Already activated? Sign In"}
              </Link>
              </div>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}