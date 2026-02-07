export type PeopleCount = 'one' | 'two' | 'three' | 'four';

export interface PoseSet {
  id: string;
  label: string;
  images: string[];
}

function getPoseImages(people: string, poseNum: number): string[] {
  return [1, 2, 3, 4].map(
    (i) => `/images/poses/${people}/pose_${people}_${poseNum}/pose_${people}_${poseNum}_${i}.svg`
  );
}

export const poseData: Record<PeopleCount, PoseSet[]> = {
  one: [
    { id: 'pose_one_1', label: '포즈 1', images: getPoseImages('one', 1) },
    { id: 'pose_one_2', label: '포즈 2', images: getPoseImages('one', 2) },
  ],
  two: [
    { id: 'pose_two_1', label: '포즈 1', images: getPoseImages('two', 1) },
    { id: 'pose_two_2', label: '포즈 2', images: getPoseImages('two', 2) },
  ],
  three: [
    { id: 'pose_three_1', label: '포즈 1', images: getPoseImages('three', 1) },
    { id: 'pose_three_2', label: '포즈 2', images: getPoseImages('three', 2) },
  ],
  four: [
    { id: 'pose_four_1', label: '포즈 1', images: getPoseImages('four', 1) },
  ],
};

export const peopleOptions: { key: PeopleCount; label: string }[] = [
  { key: 'one', label: '1명' },
  { key: 'two', label: '2명' },
  { key: 'three', label: '3명' },
  { key: 'four', label: '4명' },
];
