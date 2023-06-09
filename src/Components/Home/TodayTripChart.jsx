import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Todays Trips',
    },
    legend: {
      position: 'bottom',
    },
  },
};

export function TodayTripChart({ totalAllocated, totalCancelled, totalCompleted, totalOngoing, totalNotAllocated }) {
  const data = {
    labels: ['Alloted', 'Cancelled', 'Completed', 'Ongoing', 'Not Alloted'],
    datasets: [
      {
        label: 'Trips',
        data: [totalAllocated, totalCancelled, totalCompleted, totalOngoing, totalNotAllocated],
        backgroundColor: [
          'rgb(255, 144, 32)',
          'rgb(255, 9, 46)',
          'rgb(50, 189, 0)',
          'rgb(255, 230, 3)',
          'rgb(57, 11, 125)',
        ],
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} options={options} />;
}
