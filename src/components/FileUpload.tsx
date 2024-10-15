import React from 'react';
import { useCSVReader } from 'react-papaparse';
import { WorkoutData } from '../types';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  setWorkoutData: React.Dispatch<React.SetStateAction<WorkoutData[]>>;
}

export const FileUpload: React.FC<FileUploadProps> = ({ setWorkoutData }) => {
  const { CSVReader } = useCSVReader();

  const handleUpload = (results: any) => {
    const parsedData: WorkoutData[] = results.data.slice(1).map((row: string[]) => ({
      title: row[0],
      start_time: row[1],
      end_time: row[2],
      description: row[3],
      exercise_title: row[4],
      superset_id: row[5],
      exercise_notes: row[6],
      set_index: parseInt(row[7]),
      set_type: row[8],
      weight_kg: parseFloat(row[9]),
      reps: parseInt(row[10]),
      distance_km: parseFloat(row[11]),
      duration_seconds: parseInt(row[12]),
      rpe: parseInt(row[13]),
    }));
    setWorkoutData(parsedData);
  };

  return (
    <CSVReader onUploadAccepted={handleUpload}>
      {({ getRootProps, acceptedFile }: any) => (
        <div className="flex flex-col items-center">
          <button
            type="button"
            {...getRootProps()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Upload className="mr-2" />
            Upload CSV
          </button>
          {acceptedFile && (
            <div className="mt-2 text-sm text-gray-600">
              File: {acceptedFile.name}
            </div>
          )}
        </div>
      )}
    </CSVReader>
  );
};