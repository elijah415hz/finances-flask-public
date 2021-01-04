import React, { useEffect } from "react";
import { Container } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { AuthContext } from '../App'
import { Line } from "react-chartjs-2";
import API from "../utils/API";


export default function WallChart() {
    const theme = useTheme();
    const { Auth } = React.useContext(AuthContext)

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Income",
                data: [33, 53, 85, 41, 44, 65],
                fill: false,
                borderColor: theme.palette.primary.main
            },
            {
                label: "Expenses",
                data: [33, 25, 35, 51, 54, 76],
                fill: false,
                borderColor: theme.palette.secondary.main
            }
        ]
    };
    useEffect(() => {
        API.wallchart(Auth.token)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                if (err.message === "No Data") {
                    console.log("No Data!")
                }
            })
    }, [])
    return (
        <Container>
            <Line data={data} />
        </Container>
    );
}