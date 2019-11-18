import React from "react";
import HistoryTable from "../components/historytable";
import MicroresearchTable from "../components/microresearchtable";


const ErrorPage = () => {
        return(
            <div>
                <h2>Page Not Found.</h2>
                <HistoryTable identifier="monalisa"></HistoryTable>
                <MicroresearchTable identifier="monalisa"></MicroresearchTable>
            </div>
        )
    
}

export default ErrorPage