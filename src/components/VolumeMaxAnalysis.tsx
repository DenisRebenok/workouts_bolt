import React, { useState } from 'react';
import { WorkoutData } from '../types';
import { calculateVolumeMax } from '../utils/volumeMaxCalculations';
import { VolumeProgressionTracker } from './VolumeProgressionTracker';

interface VolumeMaxAnalysisProps {
  workoutData: WorkoutData[];
}

export const VolumeMaxAnalysis: React.FC<VolumeMaxAnalysisProps> = ({ workoutData }) => {
  const [days, setDays] = useState(7);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [showFractional, setShowFractional] = useState(false);

  const volumeData = calculateVolumeMax(workoutData, days);

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(parseInt(event.target.value));
  };

  const getRowColor = (current: number) => {
    if (current < 4) return 'bg-red-100';
    if (current >= 6) return 'bg-green-100';
    return '';
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Volume Max Analysis</h3>
      <div className="mb-4 flex items-center">
        <label htmlFor="days" className="mr-2">Rolling window (days):</label>
        <input
          type="number"
          id="days"
          value={days}
          onChange={handleDaysChange}
          className="border rounded p-1 mr-4"
          min="1"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showFractional}
            onChange={() => setShowFractional(!showFractional)}
            className="mr-2"
          />
          Show fractional sets
        </label>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Muscle Group</th>
            <th className="border p-2">Current / Max</th>
            <th className="border p-2">% of Max</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(volumeData).map(([muscleGroup, data]) => {
            const currentVolume = showFractional ? data.currentFractionalVolume : data.currentVolume;
            const maxVolume = showFractional ? data.maxFractionalVolume : data.maxVolume;
            const percentage = maxVolume > 0 ? (currentVolume / maxVolume) * 100 : 0;
            return (
              <tr 
                key={muscleGroup} 
                onClick={() => setSelectedMuscleGroup(muscleGroup)} 
                className={`cursor-pointer hover:bg-gray-100 ${getRowColor(data.currentVolume)}`}
              >
                <td className="border p-2">{muscleGroup}</td>
                <td className="border p-2">
                  {currentVolume.toFixed(1)} / {maxVolume.toFixed(1)}
                </td>
                <td className="border p-2">{percentage.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedMuscleGroup && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="text-xl font-semibold mb-2">{selectedMuscleGroup} Details</h4>
          <p>Max Volume Period: {volumeData[selectedMuscleGroup].maxVolumeStartDate.toLocaleDateString()} - {volumeData[selectedMuscleGroup].maxVolumeEndDate.toLocaleDateString()}</p>
          <p>Max Volume: {showFractional ? volumeData[selectedMuscleGroup].maxFractionalVolume.toFixed(1) : volumeData[selectedMuscleGroup].maxVolume} sets</p>
          <p>Current Volume: {showFractional ? volumeData[selectedMuscleGroup].currentFractionalVolume.toFixed(1) : volumeData[selectedMuscleGroup].currentVolume} sets</p>
        </div>
      )}
      <VolumeProgressionTracker workoutData={workoutData} />
    </div>
  );
};