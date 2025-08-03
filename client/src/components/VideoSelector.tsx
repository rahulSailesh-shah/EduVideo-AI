import React from "react";

interface VideoSelectorProps {
  videoURLOptions: React.ReactNode;
  s3URL: string;
  handleS3URLChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({
  videoURLOptions,
  s3URL,
  handleS3URLChange,
  disabled,
}) => (
  <div className="relative flex-1 max-w-xs">
    <select
      className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
      onChange={handleS3URLChange}
      value={s3URL}
      disabled={disabled}
    >
      {videoURLOptions}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
);
