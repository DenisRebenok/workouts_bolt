import { WorkoutData } from '../types';
import { getMuscleGroups } from './exerciseMapping';

// Epley formula
function epleyFormula(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

// Brzycki formula
function brzyckiFormula(weight: number, reps: number): number {
  return weight * (36 / (37 - reps));
}

// Lander formula
function landerFormula(weight: number, reps: number): number {
  return (100 * weight) / (101.3 - 2.67123 * reps);
}

// Lombardi formula
function lombardiFormula(weight: number, reps: number): number {
  return weight * Math.pow(reps, 0.1);
}

function isLowerBodyExercise(exerciseName: string): boolean {
  const lowerBodyMuscles = ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'];
  const muscleGroups = getMuscleGroups(exerciseName);
  return muscleGroups.some(group => lowerBodyMuscles.includes(group));
}

export function calculate1RM(exerciseName: string, weight: number, reps: number): number {
  const epley = epleyFormula(weight, reps);
  const brzycki = brzyckiFormula(weight, reps);
  const lander = landerFormula(weight, reps);
  const lombardi = lombardiFormula(weight, reps);

  // Use an average of all formulas
  return (epley + brzycki + lander + lombardi) / 4;
}

export function calculateRM(exerciseName: string, weight: number, reps: number, targetReps: number): number {
  const oneRM = calculate1RM(exerciseName, weight, reps);
  
  // Use Brzycki formula to estimate RM for any number of reps
  return oneRM * (37 - targetReps) / 36;
}

export function getBestSet(workoutData: WorkoutData[], exerciseName: string): WorkoutData | null {
  const exerciseSets = workoutData.filter(set => set.exercise_title === exerciseName);
  if (exerciseSets.length === 0) return null;

  return exerciseSets.reduce((bestSet, currentSet) => {
    const bestSetRM = calculate1RM(exerciseName, bestSet.weight_kg, bestSet.reps);
    const currentSetRM = calculate1RM(exerciseName, currentSet.weight_kg, currentSet.reps);
    return currentSetRM > bestSetRM ? currentSet : bestSet;
  });
}