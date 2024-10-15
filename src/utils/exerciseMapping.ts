import config from '../config.json';

interface MuscleInvolvement {
  name: string;
  fraction: number;
}

interface Exercise {
  name: string;
  muscles: MuscleInvolvement[];
}

const exerciseToMuscleGroups: { [key: string]: MuscleInvolvement[] } = {};

config.Exercises.forEach((exercise: Exercise) => {
  exerciseToMuscleGroups[exercise.name] = exercise.muscles;
});

export function getMuscleGroups(exerciseName: string): MuscleInvolvement[] {
  return exerciseToMuscleGroups[exerciseName] || [];
}

export function getAllMuscleGroups(): string[] {
  return Array.from(new Set(Object.values(exerciseToMuscleGroups).flatMap(muscles => muscles.map(m => m.name))));
}