import React from 'react';
import { WorkoutData } from '../types';
import { calculate1RM } from '../utils/strengthCalculations';

interface ExerciseHistoryProps {
  workoutData: WorkoutData[];
  exerciseName: string;
}

interface WorkoutSession {
  date: Date;
  sets: WorkoutData[];
}

export const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({ workoutData, exerciseName }) => {
  const exerciseSets = workoutData.filter(set => set.exercise_title === exerciseName);

  // Group sets by workout session
  const workoutSessions: WorkoutSession[] = exerciseSets.reduce((sessions, set) => {
    const setDate = new Date(set.start_time);
    const existingSession = sessions.find(session => 
      session.date.toDateString() === setDate.toDateString()
    );

    if (existingSession) {
      existingSession.sets.push(set);
    } else {
      sessions.push({ date: setDate, sets: [set] });
    }

    return sessions;
  }, [] as WorkoutSession[]);

  // Sort sessions by date (most recent first)
  workoutSessions.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calculate personal records
  const personalRecords = exerciseSets.reduce((records, set) => {
    const oneRM = calculate1RM(exerciseName, set.weight_kg, set.reps);
    if (oneRM > records.maxOneRM) records.maxOneRM = oneRM;
    if (set.weight_kg > records.maxWeight) records.maxWeight = set.weight_kg;
    if (set.weight_kg * set.reps > records.maxVolume) records.maxVolume = set.weight_kg * set.reps;
    return records;
  }, { maxOneRM: 0, maxWeight: 0, maxVolume: 0 });

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${days[date.getDay()]}, ${date.toLocaleDateString()}`;
  };

  const isPersonalRecord = (set: WorkoutData) => {
    const oneRM = calculate1RM(exerciseName, set.weight_kg, set.reps);
    const volume = set.weight_kg * set.reps;
    return oneRM === personalRecords.maxOneRM || 
           set.weight_kg === personalRecords.maxWeight || 
           volume === personalRecords.maxVolume;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Exercise History</h3>
      {workoutSessions.map((session, sessionIndex) => (
        <div key={sessionIndex} className="mb-4 p-4 bg-gray-100 rounded">
          <p className="font-bold">{exerciseName}</p>
          <p className="text-sm text-gray-600 mb-2">{formatDate(session.date)}</p>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Set</th>
                <th className="text-left">Weight x Reps</th>
                <th className="text-left">1RM</th>
              </tr>
            </thead>
            <tbody>
              {session.sets.map((set, setIndex) => {
                const oneRM = calculate1RM(exerciseName, set.weight_kg, set.reps);
                const isPR = isPersonalRecord(set);
                return (
                  <tr key={setIndex} className={isPR ? 'font-bold text-blue-600' : ''}>
                    <td>{setIndex + 1}</td>
                    <td>{set.weight_kg} kg x {set.reps}</td>
                    <td>{oneRM.toFixed(2)} kg</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};