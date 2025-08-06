import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatters';

interface PostTimestampProps {
  timestamp: Date;
  className?: string;
}

const PostTimestamp: React.FC<PostTimestampProps> = ({ timestamp, className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [relativeTime, setRelativeTime] = useState(formatDate(timestamp));

  // Update relative time every minute
  useEffect(() => {
    const updateTime = () => setRelativeTime(formatDate(timestamp));
    updateTime();
    
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timestamp]);

  const getDetailedTimestamp = () => {
    return timestamp.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="relative inline-block">
      <span
        className={`text-gray-500 dark:text-gray-400 text-sm cursor-help hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {relativeTime}
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 animate-fade-in">
          {getDetailedTimestamp()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      )}
    </div>
  );
};

export default PostTimestamp;