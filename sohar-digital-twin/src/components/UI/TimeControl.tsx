import { Play, Pause, SkipForward, Clock } from 'lucide-react';
import { Button } from './Button';

interface TimeControlProps {
  isRunning: boolean;
  currentTime: Date;
  speedMultiplier: number;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onJumpTime: (hours: number) => void;
}

export function TimeControl({
  isRunning,
  currentTime,
  speedMultiplier,
  onPlayPause,
  onSpeedChange,
  onJumpTime,
}: TimeControlProps) {
  const speedOptions = [1, 5, 10];

  return (
    <div className="flex items-center gap-4">
      {/* Current Time Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
        <Clock size={16} className="text-primary" />
        <span className="text-sm font-mono text-white">
          {currentTime.toLocaleTimeString()}
        </span>
      </div>

      {/* Play/Pause */}
      <Button
        variant="primary"
        size="sm"
        onClick={onPlayPause}
        className="flex items-center gap-2"
      >
        {isRunning ? <Pause size={16} /> : <Play size={16} />}
        <span>{isRunning ? 'Pause' : 'Play'}</span>
      </Button>

      {/* Speed Control */}
      <div className="flex items-center gap-1 bg-gray-800 rounded-lg border border-gray-700 p-1">
        {speedOptions.map((speed) => (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              speedMultiplier === speed
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>

      {/* Jump Time */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Jump:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onJumpTime(6)}
          className="flex items-center gap-1"
        >
          <SkipForward size={14} />
          <span>+6h</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onJumpTime(24)}
          className="flex items-center gap-1"
        >
          <SkipForward size={14} />
          <span>+24h</span>
        </Button>
      </div>
    </div>
  );
}

