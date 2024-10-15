import React, { useState } from 'react';
import { WorkoutData } from '../types';
import { VolumeAnalysis } from './VolumeAnalysis';
import { StrengthAnalysis } from './StrengthAnalysis';
import { LastTrainedAnalysis } from './LastTrainedAnalysis';

interface DataAnalysisProps {
  workoutData: WorkoutData[];
}

export const DataAnalysis: React.FC<DataAnalysisProps> = ({ workoutData }) => {
  const [activeTab, setActiveTab] = useState<'volume' | 'strength' | 'lastTrained'>('volume');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'volume' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('volume')}
        >
          Volume Analysis
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'strength' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('strength')}
        >
          Strength Analysis
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'lastTrained' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('lastTrained')}
        >
          Last Trained
        </button>
      </div>
      {activeTab === 'volume' && <VolumeAnalysis workoutData={workoutData} />}
      {activeTab === 'strength' && <StrengthAnalysis workoutData={workoutData} />}
      {activeTab === 'lastTrained' && <LastTrainedAnalysis workoutData={workoutData} />}
    </div>
  );
};