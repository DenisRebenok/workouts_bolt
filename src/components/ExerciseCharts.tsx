import React, { useState } from 'react';
import { WorkoutData } from '../types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { calculate1RM } from '../utils/strengthCalculations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ExerciseChartsProps {
  workoutData: WorkoutData[];
  exerciseName: string;
}

export const ExerciseCharts: React.FC<ExerciseChartsProps> = ({ workoutData, exerciseName }) => {
  const [timeBreakdown, setTimeBreakdown] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [metrics, setMetrics] = useState<string[]>(['1RM', 'Volume']);

  const exerciseSets = workoutData
    .filter(set => set.exercise_title === exerciseName)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const getDateKey = (date: Date) => {
    switch (timeBreakdown) {
      case 'week':
        return `${date.getFullYear()}-W${Math.floor(date.getDate() / 7) + 1}`;
      case 'month':
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
      case 'year':
        return `${date.getFullYear()}`;
      default:
        return date.toISOString().split('T')[0];
    }
  };

  const chartData = exerciseSets.reduce((acc, set) => {
    const date = new Date(set.start_time);
    const dateKey = getDateKey(date);
    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, '1RM': 0, 'Volume': 0, 'Sets': 0 };
    }
    const oneRM = calculate1RM(exerciseName, set.weight_kg, set.reps);
    acc[dateKey]['1RM'] = Math.max(acc[dateKey]['1RM'], oneRM);
    acc[dateKey]['Volume'] += set.weight_kg * set.reps;
    acc[dateKey]['Sets']++;
    return acc;
  }, {} as { [key: string]: { date: string; '1RM': number; 'Volume': number; 'Sets': number } });

  const chartLabels = Object.keys(chartData);
  const datasets = metrics.map(metric => ({
    label: metric,
    data: chartLabels.map(label => chartData[label][metric as keyof typeof chartData[typeof label]]),
    borderColor: metric === '1RM' ? 'rgb(255, 99, 132)' : metric === 'Volume' ? 'rgb(54, 162, 235)' : 'rgb(75, 192, 192)',
    tension: 0.1
  }));

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${exerciseName} Progress`,
      },
    },
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Exercise Charts</h3>
      <div className="mb-4">
        <select
          value={timeBreakdown}
          onChange={(e) => setTimeBreakdown(e.target.value as 'week' | 'month' | 'year' | 'all')}
          className="mr-2 p-2 border rounded"
        >
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
          <option value="all">All-time</option>
        </select>
        {['1RM', 'Volume', 'Sets'].map(metric => (
          <label key={metric} className="mr-2">
            <input
              type="checkbox"
              checked={metrics.includes(metric)}
              onChange={() => {
                if (metrics.includes(metric)) {
                  setMetrics(metrics.filter(m => m !== metric));
                } else {
                  setMetrics([...metrics, metric]);
                }
              }}
            />
            {metric}
          </label>
        ))}
      </div>
      <Line options={options} data={{ labels: chartLabels, datasets }} />
    </div>
  );
};