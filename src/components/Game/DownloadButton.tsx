import React, { useState, useEffect } from 'react';
import { Download, Clock } from 'lucide-react';

interface DownloadButtonProps {
  downloadLink: string;
  gameName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ downloadLink, gameName }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev! - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleDownload();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(10);
    setIsDownloading(true);
  };

  const handleDownload = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = `${gameName.replace(/\s+/g, '_')}_mod.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset state
    setCountdown(null);
    setIsDownloading(false);
  };

  const isDisabled = countdown !== null && countdown > 0;

  return (
    <button
      onClick={startCountdown}
      disabled={isDisabled}
      className={`
        flex items-center justify-center space-x-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 min-w-[200px]
        ${isDisabled 
          ? 'bg-gray-400 cursor-not-allowed text-white' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
        }
      `}
    >
      {countdown !== null && countdown > 0 ? (
        <>
          <Clock className="h-5 w-5" />
          <span>Download in {countdown}s</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          <span>Download Now</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;