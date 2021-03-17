import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
      MY EXO | BUY
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
    const classes = useStyles();

    const [fname, changefname] = React.useState("");
    const [lname, changelname] = React.useState("");
    const [mname, changemname] = React.useState("");
    const [sname, changesname] = React.useState("");
    const [email, changeEmail] = React.useState("");
    const [password, changePassword] = React.useState("");

    const [apiOutput, changeAPIOutput] = React.useState({});
    const [isLoading, changeLoading] = React.useState(false);
    const [timer, setTimer] = React.useState(false);

    //api call to register
    const requestRegister = () => {
        changeLoading(true);
        axios.post('https://api.dev.myexobuy.com/account/register', {
            nombre1: fname,
            nombre2: mname,
            apellido1: lname,
            apellido2: sname,
            email: email,
            password: password
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(result => {changeAPIOutput(result.data); changeLoading(false); openResponse()})
        .catch(err => console.log(err))
    }

    //function to show loading while regestering is processing
    function ButtonLoad(){
        if(isLoading){
            return <div style={{textAlign: 'center'}}>
                        <CircularProgress />
                    </div>
        }
        else{
            return <Button
                        onClick={() => requestRegister()}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                    Sign Up
                    </Button>
        }
    }

    //function that opens the response for 3 seconds
    function openResponse(){
        setTimer(true);
        setTimeout(() => {
            setTimer(false);
        }, 3000);  
    }

    //function that displays the output message from the api call to register
    function DisplayOutput() {
        if(timer){
            if(apiOutput.statusCode === 0){
                return <Typography variant="h6" color="error">{apiOutput.message}</Typography>
            }
            else if(apiOutput.statusCode === 1){
                return <div/>
            }
            else{
                return <Typography variant="h6" color="error">Something Went Wrong!</Typography>
            }
        }
        else{
            return <div/>
        }
    }

    //function to reroute them back to login after sucessful registration
    function routeLogin(){
        setTimeout(() => {
            window.location.replace('/login');
        }, 8500)
    }
    if (apiOutput.statusCode === 1){
        return (<Container component="main" maxWidth="xs">
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign up
            </Typography>
            <Typography style={{marginTop: 40, textAlign: 'center'}} variant="h6">
            You're account has been successfully created!
            </Typography>
            <Typography style={{textAlign: 'center'}} variant="h6">
            An email has been sent to you with a link to verify your account.
            </Typography>
            <Typography style={{marginTop: 40, textAlign: 'center'}} variant="subtitle2">
            You will be redirected automatically to the login page, or <Link href="/login" variant="subtitle2">
                    click here
            </Link> 
            </Typography>
            <CircularProgress size={24} />
            {routeLogin()}
            </div>
        <Box mt={5}>
            <Copyright />
        </Box>
        </Container>);
    }
    else{return (
        <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            REGISTER
            </Typography>
            <DisplayOutput/>
            <div className={classes.form}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    disabled={isLoading}
                    value={fname}
                    onChange={event => changefname(event.target.value)}
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    disabled={isLoading}
                    value={lname}
                    onChange={event => changelname(event.target.value)}
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    disabled={isLoading}
                    value={mname}
                    onChange={event => changemname(event.target.value)}
                    name="middleName"
                    variant="outlined"
                    fullWidth
                    id="middleName"
                    label="Middle Name"
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    disabled={isLoading}
                    value={sname}
                    onChange={event => changesname(event.target.value)}
                    variant="outlined"
                    fullWidth
                    id="secondSurname"
                    label="Second Surname"
                    name="secondSurname"
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    disabled={isLoading}
                    value={email}
                    onChange={event => changeEmail(event.target.value)}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    disabled={isLoading}
                    value={password}
                    onChange={event => changePassword(event.target.value)}
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                </Grid>
                <Grid item xs={12}>
                <FormControlLabel
                    disabled={isLoading}
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive news, marketing promotions and updates via email."
                />
                </Grid>
            </Grid>
            
            <ButtonLoad />
            
            <Grid container justify="flex-end">
                <Grid item>
                <Link href="/login" variant="body2">
                    Already have an account? Sign in
                </Link>
                </Grid>
            </Grid>
            </div>
        </div>
        <Box mt={5}>
            <Copyright />
        </Box>
        </Container>
    );
}
    
}