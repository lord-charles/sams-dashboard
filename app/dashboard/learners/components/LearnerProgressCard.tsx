import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProgressEntry {
  year: number;
  class: string;
  educationLevel: string;
  school: string;
  code: string;
  learnerUniqueID: number;
  reference: string;
  attendanceRate: number;
  status: string;
  remarks: string;
}

export interface LearnerProgressProps {
  progress: ProgressEntry[];
  learnerUniqueID: number;
  reference: string;
}

const Timeline: React.FC<{ entries: ProgressEntry[] }> = ({ entries }) => (
  <ol className="relative border-l border-gray-200 dark:border-gray-700">
    {entries.map((entry, index) => (
      <li key={index} className="mb-10 ml-6">
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
          <svg
            className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </span>
        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {entry.year} - {entry.class}
          {index === 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3">
              Latest
            </span>
          )}
        </h3>
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
          {entry.educationLevel} at {entry.school}
        </time>
        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
          Status: {entry.status} | Attendance Rate: {entry.attendanceRate}%
        </p>
        {entry.remarks && (
          <p className="text-sm italic text-gray-600 dark:text-gray-300">
            Remarks: {entry.remarks}
          </p>
        )}
      </li>
    ))}
  </ol>
);

const LearnerProgressCard: React.FC<LearnerProgressProps> = ({
  progress,
  learnerUniqueID,
  reference,
}) => {
  const latestEntry = progress[0];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Learner Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Learner ID: {latestEntry.learnerUniqueID || learnerUniqueID}
          </p>
          <p className="text-sm text-gray-500">
            Reference: {latestEntry.reference || reference}
          </p>
        </div>
        <Timeline entries={progress} />
      </CardContent>
    </Card>
  );
};

export default LearnerProgressCard;
