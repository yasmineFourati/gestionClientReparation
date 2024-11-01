
import React from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RepairChart = ({ ongoingRepairs, completedRepairs }) => {
  const data = {
    labels: ['Ongoing Repairs', 'Completed Repairs'],
    datasets: [
      {
        label: 'Repairs',
        data: [ongoingRepairs, completedRepairs],
        backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} />;
};

export default RepairChart;
