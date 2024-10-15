import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataAnalysis } from './components/DataAnalysis';
import { WorkoutData } from './types';
import { BarChart, Activity } from 'lucide-react';

function App() {
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center">
        <Activity className="mr-2" /> Workout Data Analysis
      </h1>
      <FileUpload setWorkoutData={setWorkoutData} />
      {workoutData.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <BarChart className="mr-2" /> Analysis Results
          </h2>
          <DataAnalysis workoutData={workoutData} />
        </div>
      )}
    </div>
  );
}

export default App;