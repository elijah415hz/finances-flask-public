import React from "react";
import { Box, Container } from '@material-ui/core';
import { Line } from "react-chartjs-2";
import { ChartJSDataType } from "../interfaces/Interfaces";


export default function WallChart({ data }: { data: ChartJSDataType }) {
    return (
        <Container>
            <Box maxHeight='50vh'>
                <Line data={data} height={300} width={600} options={{
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            ticks: {
                                fontColor: "#404B50"
                            },
                            gridLines: {
                                color: "#404B50",
                                zeroLineColor: "#404B50",
                                drawOnChartArea: false
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontColor: "#404B50",
                                callback: function (value) {
                                    if (value >= 1000) {
                                        return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    } else {
                                        return '$' + value;
                                    }
                                }
                            },
                            gridLines: {
                                color: "#404B50",
                                zeroLineColor: "#404B50",
                                drawOnChartArea: false
                            }
                        }]
                    }

                }} />
            </Box>
        </Container>
    );
}