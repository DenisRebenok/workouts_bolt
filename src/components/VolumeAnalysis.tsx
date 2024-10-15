import React, { useState, useMemo } from 'react';
import { WorkoutData } from '../types';
import { getFractionalVolume, getCustomDateRanges } from '../utils/volumeCalculations';
import { getAllMuscleGroups } from '../utils/exerciseMapping';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { VolumeMaxAnalysis } from './VolumeMaxAnalysis';
import { VolumeProgressionTracker } from './VolumeProgressionTracker';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface VolumeAnalysisProps {
  workoutData: WorkoutData[];
}

export const VolumeAnalysis: React.FC<VolumeAnalysisProps> = ({ workoutData }) => {
  // ... (previous code remains unchanged)

  return (
    <div className="card">
      <h3 className="text-2xl font-semibold mb-4">Set Count Tracker and Analyzer</h3>
      {/* ... (previous code remains unchanged) */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* ... (table content remains unchanged) */}
        </table>
      </div>
      <VolumeMaxAnalysis workoutData={workoutData} />
      <VolumeProgressionTracker workoutData={workoutData} />
    </div>
  );
};