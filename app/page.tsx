'use client';

import { useState } from 'react';
import type { PeopleCount, PoseSet } from '@/data/poses';
import SelectPeople from '@/components/SelectPeople';
import SelectPose from '@/components/SelectPose';
import Camera from '@/components/Camera';
import Result from '@/components/Result';

type Step = 'selectPeople' | 'selectPose' | 'camera' | 'result';

export default function Home() {
  const [step, setStep] = useState<Step>('selectPeople');
  const [peopleCount, setPeopleCount] = useState<PeopleCount | null>(null);
  const [selectedPose, setSelectedPose] = useState<PoseSet | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSelectPeople = (count: PeopleCount) => {
    setPeopleCount(count);
    setStep('selectPose');
  };

  const handleSelectPose = (pose: PoseSet) => {
    setSelectedPose(pose);
    setStep('camera');
  };

  const handlePhotosComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStep('result');
  };

  const handleReset = () => {
    setStep('selectPeople');
    setPeopleCount(null);
    setSelectedPose(null);
    setPhotos([]);
  };

  const handleBackToPeople = () => {
    setPeopleCount(null);
    setStep('selectPeople');
  };

  return (
    <div className="app">
      {step === 'selectPeople' && (
        <SelectPeople onSelect={handleSelectPeople} />
      )}
      {step === 'selectPose' && peopleCount && (
        <SelectPose
          peopleCount={peopleCount}
          onSelect={handleSelectPose}
          onBack={handleBackToPeople}
        />
      )}
      {step === 'camera' && selectedPose && (
        <Camera
          poseImages={selectedPose.images}
          onComplete={handlePhotosComplete}
        />
      )}
      {step === 'result' && photos.length === 4 && (
        <Result photos={photos} onReset={handleReset} />
      )}
    </div>
  );
}
