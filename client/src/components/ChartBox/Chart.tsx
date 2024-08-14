import React, { useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

Chart.register(...registerables, annotationPlugin)

const CustomLineChart: React.FC = () => {
  const chartRef = useRef<Chart<'line'>>(null)

  const data = {
    labels: ['Jul 8', 'Jul 9', 'Jul 10', 'Jul 11', 'Jul 12', 'Jul 13', 'Jul 14'],
    datasets: [
      {
        label: 'Stock Price',
        data: [1200, 1300, 1250, 1220, 1250, 1280, 1300],
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 2,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart

          if (!chartArea) {
            return null
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(255, 165, 0, 0.5)')
          gradient.addColorStop(1, 'rgba(255, 165, 0, 0)')

          return gradient
        },
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Bought Stocks',
        data: [null, 1300, null, 1220, null, null, 1300],
        backgroundColor: '#ca6702',
        borderColor: '#ca6702',
        pointRadius: 5,
        type: 'scatter',
        showLine: false,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: 'Jul 9',
            borderColor: '#ca6702',
            borderWidth: 1,
            label: {
              content: 'Bought',
              enabled: true,
              position: 'top',
            },
          },
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: 'Jul 11',
            borderColor: '#ca6702',
            borderWidth: 1,
            label: {
              content: 'Bought',
              enabled: true,
              position: 'top',
            },
          },
        ],
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    layout: {
      padding: 20,
    },
  }

  return <Line ref={chartRef} data={data} options={options} />
}

export default CustomLineChart
