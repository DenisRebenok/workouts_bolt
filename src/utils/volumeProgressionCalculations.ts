import { WorkoutData } from '../types';
import { getMuscleGroups } from './exerciseMapping';

export function calculateWeeklyVolume(workoutData: WorkoutData[], weeks: number): { [key: string]: { [key: string]: number } } {
  const volumeData: { [key: string]: { [key: string]: number } } = {};
  const now = new Date();
  const startDate = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);

  workoutData.forEach((set) => {
    const setDate = new Date(set.start_time);
    if (setDate < startDate) return;

    const weekNumber = Math.floor((now.getTime() - setDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const weekLabel = `Week ${weeks - weekNumber}`;

    if (set.set_type === 'warmup') return;

    const muscleInvolvements = getMuscleGroups(set.exercise_title);
    muscleInvolvements.forEach(involvement => {
      if (!volumeData[involvement.name]) {
        volumeData[involvement.name] = {};
      }
      if (!volumeData[involvement.name][weekLabel]) {
        volumeData[involvement.name][weekLabel] = 0;
      }
      volumeData[involvement.name][weekLabel] += 1;
    });
  });

  // Fill in missing weeks with zero volume
  Object.keys(volumeData).forEach(muscleGroup => {
    for (let i = 1; i <= weeks; i++) {
      const weekLabel = `Week ${i}`;
      if (!volumeData[muscleGroup][weekLabel]) {
        volumeData[muscleGroup][weekLabel] = 0;
      }
    }
  });

  return volumeData;
}