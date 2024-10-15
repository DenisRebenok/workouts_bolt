import { WorkoutData } from '../types';
import { getMuscleGroups } from './exerciseMapping';

interface VolumeData {
  currentVolume: number;
  currentFractionalVolume: number;
  maxVolume: number;
  maxFractionalVolume: number;
  maxVolumeStartDate: Date;
  maxVolumeEndDate: Date;
}

export function calculateVolumeMax(workoutData: WorkoutData[], days: number = 7): { [key: string]: VolumeData } {
  const volumeData: { [key: string]: VolumeData } = {};
  const now = new Date();

  // Initialize volumeData for all muscle groups
  const allMuscleGroups = new Set(workoutData.flatMap(set => getMuscleGroups(set.exercise_title).map(m => m.name)));
  allMuscleGroups.forEach(muscleGroup => {
    volumeData[muscleGroup] = {
      currentVolume: 0,
      currentFractionalVolume: 0,
      maxVolume: 0,
      maxFractionalVolume: 0,
      maxVolumeStartDate: new Date(0),
      maxVolumeEndDate: new Date(0)
    };
  });

  // Sort workoutData by date, most recent first
  workoutData.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  // Calculate current volume and find max volume
  for (let i = 0; i < workoutData.length; i++) {
    const set = workoutData[i];
    const setDate = new Date(set.start_time);
    const daysSinceSet = Math.floor((now.getTime() - setDate.getTime()) / (1000 * 3600 * 24));

    // Skip warmup sets
    if (set.set_type === 'warmup') continue;

    const muscleInvolvements = getMuscleGroups(set.exercise_title);
    
    // Calculate current volume
    if (daysSinceSet <= days) {
      muscleInvolvements.forEach(involvement => {
        volumeData[involvement.name].currentVolume += 1; // Count as 1 set
        volumeData[involvement.name].currentFractionalVolume += involvement.fraction; // Add fractional involvement
      });
    }

    // Calculate rolling window volume
    let windowStart = new Date(setDate);
    windowStart.setDate(windowStart.getDate() - days + 1);
    let windowVolume: { [key: string]: { sets: number, fractional: number } } = {};

    for (let j = i; j < workoutData.length; j++) {
      const windowSet = workoutData[j];
      const windowSetDate = new Date(windowSet.start_time);

      if (windowSetDate < windowStart) break;

      // Skip warmup sets
      if (windowSet.set_type === 'warmup') continue;

      const windowMuscleInvolvements = getMuscleGroups(windowSet.exercise_title);
      windowMuscleInvolvements.forEach(involvement => {
        if (!windowVolume[involvement.name]) {
          windowVolume[involvement.name] = { sets: 0, fractional: 0 };
        }
        windowVolume[involvement.name].sets += 1; // Count as 1 set
        windowVolume[involvement.name].fractional += involvement.fraction; // Add fractional involvement
      });
    }

    // Update max volume if necessary
    Object.entries(windowVolume).forEach(([muscleGroup, volume]) => {
      if (volume.sets > volumeData[muscleGroup].maxVolume || 
         (volume.sets === volumeData[muscleGroup].maxVolume && volume.fractional > volumeData[muscleGroup].maxFractionalVolume)) {
        volumeData[muscleGroup].maxVolume = volume.sets;
        volumeData[muscleGroup].maxFractionalVolume = volume.fractional;
        volumeData[muscleGroup].maxVolumeStartDate = new Date(windowStart);
        volumeData[muscleGroup].maxVolumeEndDate = new Date(setDate);
      }
    });
  }

  return volumeData;
}

export const bestPracticesRules: { [key: string]: { min: number; max: number } } = {
  Pecs: { min: 10, max: 20 },
  Back: { min: 10, max: 20 },
  Quadriceps: { min: 8, max: 16 },
  Hamstrings: { min: 8, max: 16 },
  Glutes: { min: 8, max: 16 },
  Biceps: { min: 6, max: 12 },
  Triceps: { min: 6, max: 12 },
  'Side Delts': { min: 6, max: 12 },
  'Front Delts': { min: 4, max: 8 },
  Calves: { min: 6, max: 12 },
  ABS: { min: 6, max: 12 },
  'Lower Back': { min: 4, max: 8 },
};