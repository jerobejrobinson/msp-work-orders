'use client'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
};

const labels = ['September', 'October', 'November'];

const data = {
    labels,
    datasets: [
      {
        label: 'Invoiced',
        data: [140],
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      },
    ],
};

export default function BillingChart({chart}: any) {
    console.log(chart)
    return <Bar options={options} data={chart} style={{'maxHeight': '327px'}} className="w-full max-w-7xl "/>
}