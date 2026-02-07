'use client';

import type { PeopleCount, PoseSet } from '@/data/poses';
import { poseData } from '@/data/poses';

interface Props {
  peopleCount: PeopleCount;
  onSelect: (pose: PoseSet) => void;
  onBack: () => void;
}

export default function SelectPose({ peopleCount, onSelect, onBack }: Props) {
  const poses = poseData[peopleCount];

  return (
    <div className="page select-pose">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <button className="back-btn" onClick={onBack}>
        ← 뒤로
      </button>
      <h1 className="title">포즈를 선택하세요</h1>
      <div className="pose-grid">
        {poses.map((pose) => (
          <button
            key={pose.id}
            className="pose-card"
            onClick={() => onSelect(pose)}
          >
            <div className="pose-preview">
              {pose.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt={`${pose.label} - ${i + 1}`} />
              ))}
            </div>
            <span className="pose-label">{pose.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
