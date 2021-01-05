import React, { useEffect, useState, useReducer } from "react";
import { Container } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { AuthContext } from '../App'
import { Line } from "react-chartjs-2";
import API from "../utils/API";
import { saveWallChartData, loadWallChartData } from '../utils/db'
import { ChartJSDataType, WallChartData } from "../interfaces/Interfaces";


export default function WallChart() {
    const theme = useTheme();
    const { Auth } = React.useContext(AuthContext)

    function reducer(state: ChartJSDataType, action: WallChartData): ChartJSDataType {
        if (action.labels.length > 0) {
            state = {
                labels: action.labels,
                datasets: [
                    {
                        label: "Income",
                        data: action.income,
                        fill: false,
                        borderColor: theme.palette.primary.main
                    },
                    {
                        label: "Expenses",
                        data: action.expenses,
                        fill: false,
                        borderColor: theme.palette.secondary.main
                    }
                ]
            }
        }
        return state

    }

    const [data, setData] = useReducer(reducer, {
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
    })

    useEffect(() => {
        API.wallchart(Auth.token)
            .then(res => {
                setData(res)
                saveWallChartData(res)
            })
            .catch(err => {
                if (err.message === "No Data") {
                    console.log("No Data!")
                } else {
                    loadWallChartData().then((data: WallChartData) => setData(data))
                }
            })
    }, [])
    return (
        <Container>
            <Line data={data} />
        </Container>
    );
}