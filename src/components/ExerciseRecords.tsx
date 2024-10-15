import React from 'react';
import { WorkoutData } from '../types';
import { calculate1RM, calculateRM } from '../utils/strengthCalculations';

interface ExerciseRecordsProps {
  workoutData: WorkoutData[];
  exerciseName: string;
}

export const ExerciseRecords: React.FC<ExerciseRecordsProps> = ({ workoutData, exerciseName }) => {
  const exerciseSets = workoutData.filter(set => set.exercise_title === exerciseName);

  const records = exerciseSets.reduce((acc, set) => {
    const oneRM = calculate1RM(exerciseName, set.weight_kg, set.reps);
    if (oneRM > acc.oneRM.value) {
      acc.oneRM = { value: oneRM, set };
    }
    if (set.weight_kg > acc.maxWeight.value) {
      acc.maxWeight = { value: set.weight_kg, set };
    }
    const volume = set.weight_kg * set.reps;
    if (volume > acc.maxVolume.value) {
      acc.maxVolume = { value: volume, set };
    }
    return acc;
  }, {
    oneRM: { value: 0, set: null as WorkoutData | null },
    maxWeight: { value: 0, set: null as WorkoutData | null },
    maxVolume: { value: 0, set: null as WorkoutData | null },
  });

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Exercise Records</h3>
      <div className="mb-4">
        <p>1RM: {records.oneRM.value.toFixed(2)}kg ({records.oneRM.set?.weight_kg}kg x {records.oneRM.set?.reps}) @ {formatDate(records.oneRM.set?.start_time || '')}</p>
        <p>Max Weight: {records.maxWeight.value}kg (x{records.maxWeight.set?.reps}) @ {formatDate(records.maxWeight.set?.start_time || '')}</p>
        <p>Max Volume: {records.maxVolume.value}kg ({records.maxVolume.set?.weight_kg}kg x {records.maxVolume.set?.reps}) @ {formatDate(records.maxVolume.set?.start_time || '')}</p>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Reps</th>
            <th className="border p-2">Best Performance</th>
            <th className="border p-2">Predicted</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(reps => {
            const bestSet = exerciseSets.reduce((best, set) => {
              return set.reps === reps && set.weight_kg > (best?.weight_kg || 0) ? set : best;
            }, null as WorkoutData | null);

            const predictedRM = records.oneRM.value ? calculateRM(exerciseName, records.oneRM.value, 1, reps) : 0;

            return (
              <tr key={reps}>
                <td className="border p-2">{reps}</td>
                <td className="border p-2">
                  {bestSet
                    ? `${bestSet.weight_kg}kg (x${bestSet.reps}) @ ${formatDate(bestSet.start_time)}`
                    : 'N/A'}
                </td>
                <td className="border p-2">{predictedRM.toFixed(2)}kg</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};