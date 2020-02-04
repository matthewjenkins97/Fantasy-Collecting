import React from "react";
import ReactDOM from "react-dom";
import TradeOption from "../components/tradeoption";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import * as serverfuncs from "../serverfuncs";

const TradeOptionPage = () => {
        return(
            <div>
                <TradeOption />
            </div>
        )
    
}

export default TradeOption