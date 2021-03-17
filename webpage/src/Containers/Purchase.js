import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import socketIOClient from "socket.io-client";

const endpoint = "http://localhost:4000";

class Purchase extends Component {
    constructor(props){
        super(props);
        this.state={
            button: 0,
            currentStage: 0,
            message: "",
            link: ""
        }

        this.socket = socketIOClient(endpoint, {secure: true, 'query': "token="+props.socketToken});
        this.socket.on("connect", () => {
            this.setState({currentStage: 2});
        })

        this.socket.on('error', () => {
            console.log('invalid token');
            this.setState({currentStage: -1});
        })

        this.socket.on('step1', (msg) => {
            console.log(msg)
            this.socket.emit('cart')
        })

        this.socket.on("unauthorized", (error) => {
            console.log(error);
            this.setState({currentStage: -1});
            if (error.type === "UnauthorizedError" || error.code === "invalid_token") {
              // redirect user to login page perhaps?
              //console.log("User's token has expired");
            }
        });
        /*
        this.socket.on("connect", () => {
            this.socket.emit('cart', props.token);
            this.setState({currentStage: 2});
        })
        */
        this.socket.on("disconnect", (data) => {
            console.log(data)
            this.setState({currentStage: -1});
        })

        this.socket.on("welcome", (data) => {
            console.log(data)
            this.setState({currentStage: 1});
        })
        
        this.socket.on("cartStatus", (data) => {
            console.log(data)
            if(data.statusCode === 1){
                this.setState({currentStage: 3, message: data.message});
            }
            else{
                this.setState({currentStage: -1, message: data.message});
            }
        })
        this.socket.on("status", (data) => {
            console.log(data)
            if(data.statusCode === 1){
                this.setState({currentStage: 5, message: data.message});
            }
            else{
                this.setState({currentStage: -1, message: data.message});
            }
        })
        this.socket.on("paypallink", (data) => {
            console.log(data.link)
            this.setState({link: data.link, currentStage: 4})
        })
    }

    componentWillUnmount(){
        this.socket.disconnect();
    }

    DisplayStep(props){
        switch(props.stage){
            case -1:
                return <p>disconnected</p>
            case 0:
                return <div/>
            case 1:
                return <p>connected</p>
            case 2:
                return <p>processing cart</p>
            case 3:
                return <p>Cart Succesful</p>
            case 4:
                return <React.Fragment><p>Waiting for payment</p><a rel="noopener noreferrer" href={props.link} target="_blank" style={{color: 'blue'}}> Click here to pay</a></React.Fragment>
            case 5:
                return <p>Sucessfully purchased</p>
            default:
                return <div/>
        }
        
    }

    
    
    render() {
        console.log(this.state.message);
        return (
            <div>
                <Button disabled={this.state.currentStage === -1} onClick={() => {this.socket.disconnect(); this.props.goBack()}} variant="contained" style={{marginTop: 100}}>Cancel</Button>
                <this.DisplayStep stage={this.state.currentStage} link={this.state.link} emitPayment={() => this.socket.emit('completePayment')}/>
            </div>
        );
    }
}

export default Purchase;