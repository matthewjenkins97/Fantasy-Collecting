import React from "react";
import ReactDOM from "react-dom";
import Auction from "../components/auction";

const AuctionPage = () => {
    return(
        <div>
            <Auction />
            {/* <h1>Login</h1>
            username:<input type = 'text' id = 'liusername'></input>
            <p></p>password:<input type = 'text' id = 'lipassword'></input>
            <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
            <p></p><button onClick = {serverfuncs.logOutUser}>log out</button> */}
        </div>
    )

}

export default AuctionPage