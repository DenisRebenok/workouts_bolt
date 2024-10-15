import React, { useState } from 'react';
import { WorkoutData } from '../types';
import { ExerciseHistory } from './ExerciseHistory';
import { ExerciseCharts } from './ExerciseCharts';
import { ExerciseRecords } from './ExerciseRecords';

interface StrengthAnalysisProps {
  workoutData: WorkoutData[];
}

export const StrengthAnalysis: React.FC<StrengthAnalysisProps> = ({ workoutData }) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'history' | 'charts' | 'records'>('history');

  const exerciseCounts = workoutData.reduce((acc: { [key: string]: number }, workout) => {
    acc[workout.exercise_title] = (acc[workout.exercise_title] || 0) + 1;
    return acc;
  }, {});

  const handleExerciseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExercise(event.target.value);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Strength Analysis</h3>
      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={selectedExercise}
          onChange={handleExerciseChange}
        >
          <option value="">Select an exercise</option>
          {Object.keys(exerciseCounts).map((exercise) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      </div>
      {selectedExercise && (
        <div>
          <div className="flex mb-4">
            <button
              className={`mr-2 px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded ${activeTab === 'charts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('charts')}
            >
              Charts
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'records' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('records')}
            >
              Records
            </button>
          </div>
          {activeTab === 'history' && <ExerciseHistory workoutData={workoutData} exerciseName={selectedExercise} />}
          {activeTab === 'charts' && <ExerciseCharts workoutData={workoutData} exerciseName={selectedExercise} />}
          {activeTab === 'records' && <ExerciseRecords workoutData={workoutData} exerciseName={selectedExercise} />}
        </div>
      )}
    </div>
  );
};