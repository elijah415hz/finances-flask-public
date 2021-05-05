import React from "react";
import { Box, Container } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { ChartJSDataType } from "../interfaces/Interfaces";

export default function WallChart({ data }: { data: ChartJSDataType }) {
  return (
    <Container>
      <Box maxHeight="50vh">
        <Line
          data={data}
          height={300}
          width={600}
          options={{
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  ticks: {
                    fontColor: "#fff",
                  },
                  gridLines: {
                    color: "#fff",
                    zeroLineColor: "#fff",
                    drawOnChartArea: false,
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    fontColor: "#fff",
                    callback: function (value) {
                      if (value >= 1000) {
                        return (
                          "$" +
                          value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        );
                      } else {
                        return "$" + value;
                      }
                    },
                  },
                  gridLines: {
                    color: "#fff",
                    zeroLineColor: "#fff",
                    drawOnChartArea: false,
                  },
                },
              ],
            },
          }}
        />
      </Box>
    </Container>
  );
}
