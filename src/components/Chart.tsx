import React, { useEffect, useState } from "react";
import { Container } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { AuthContext } from '../App'
import { Line } from "react-chartjs-2";
import API from "../utils/API";
import { ChartJSDataType } from "../interfaces/Interfaces";


export default function WallChart() {
    const theme = useTheme();
    const { Auth } = React.useContext(AuthContext)

    const [data, setData] = useState<ChartJSDataType>(
        {
            labels: [],
            datasets: [
                {
                    label: "Income",
                    data: [],
                    fill: false,
                    borderColor: theme.palette.primary.main
                },
                {
                    label: "Expenses",
                    data: [],
                    fill: false,
                    borderColor: theme.palette.secondary.main
                }
            ]
        }
    )
    useEffect(() => {
        API.wallchart(Auth.token)
            .then(res => {
                console.log(res)
                let freshData: ChartJSDataType = {
                    labels: res.labels,
                    datasets: [
                        {
                            label: "Income",
                            data: res.income,
                            fill: false,
                            borderColor: theme.palette.primary.main
                        },
                        {
                            label: "Expenses",
                            data: res.expenses,
                            fill: false,
                            borderColor: theme.palette.secondary.main
                        }
                    ]
                }
                setData(freshData)
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