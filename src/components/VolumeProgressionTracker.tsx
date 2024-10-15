import React, { useState, useMemo } from 'react';
import { WorkoutData } from '../types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { calculateWeeklyVolume } from '../utils/volumeProgressionCalculations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface VolumeProgressionTrackerProps {
  workoutData: WorkoutData[];
}

export const VolumeProgressionTracker: React.FC<VolumeProgressionTrackerProps> = ({ workoutData }) => {
  const [weeks, setWeeks] = useState(12);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);

  const weeklyVolumeData = useMemo(() => calculateWeeklyVolume(workoutData, weeks), [workoutData, weeks]);

  const handleWeeksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeeks(parseInt(event.target.value));
  };

  const toggleMuscleGroup = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(muscleGroup)
        ? prev.filter(mg => mg !== muscleGroup)
        : [...prev, muscleGroup]
    );
  };

  const chartData = {
    labels: Object.keys(weeklyVolumeData[Object.keys(weeklyVolumeData)[0]] || {}),
    datasets: selectedMuscleGroups.map((muscleGroup, index) => ({
      label: muscleGroup,
      data: Object.values(weeklyVolumeData[muscleGroup] || {}),
      borderColor: `hsl(${index * 360 / selectedMuscleGroups.length}, 70%, 50%)`,
      fill: false,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Volume (Sets)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Weeks',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Volume Progression Over Time',
      },
    },
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Volume Progression Tracker</h3>
      <div className="mb-4 flex items-center">
        <label htmlFor="weeks" className="mr-2">Number of weeks:</label>
        <input
          type="number"
          id="weeks"
          value={weeks}
          onChange={handleWeeksChange}
          className="border rounded p-1 mr-4"
          min="1"
        />
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Select Muscle Groups:</h4>
        <div className="flex flex-wrap">
          {Object.keys(weeklyVolumeData).map(muscleGroup => (
            <label key={muscleGroup} className="mr-4 mb-2 flex items-center">
              <input
                type="checkbox"
                checked={selectedMuscleGroups.includes(muscleGroup)}
                onChange={() => toggleMuscleGroup(muscleGroup)}
                className="mr-1"
              />
              {muscleGroup}
            </label>
          ))}
        </div>
      </div>
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};