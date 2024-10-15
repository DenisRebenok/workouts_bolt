import React from 'react';
import { WorkoutData } from '../types';
import { getLastTrainedDates } from '../utils/lastTrainedCalculations';

interface LastTrainedAnalysisProps {
  workoutData: WorkoutData[];
}

export const LastTrainedAnalysis: React.FC<LastTrainedAnalysisProps> = ({ workoutData }) => {
  const lastTrainedDates = getLastTrainedDates(workoutData);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Last Trained Analysis</h3>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Muscle Group</th>
            <th className="border p-2">Last Trained</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(lastTrainedDates).map(([muscleGroup, lastTrained]) => (
            <tr key={muscleGroup}>
              <td className="border p-2">{muscleGroup}</td>
              <td className="border p-2">{lastTrained}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};