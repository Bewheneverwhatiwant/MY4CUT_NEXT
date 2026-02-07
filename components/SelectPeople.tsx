'use client';

import type { PeopleCount } from '@/data/poses';
import { peopleOptions } from '@/data/poses';

interface Props {
  onSelect: (count: PeopleCount) => void;
}

const icons: Record<PeopleCount, string> = {
  one: '🧍',
  two: '🧍‍♂️🧍‍♀️',
  three: '🧍🧍‍♂️🧍‍♀️',
  four: '🧍🧍‍♂️🧍‍♀️🧍',
};

export default function SelectPeople({ onSelect }: Props) {
  return (
    <div className="page select-people">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo_main.svg" alt="MY-4-CUT" className="logo-main" />
      <p className="subtitle">인원을 선택하세요!</p>
      <div className="people-grid">
        {peopleOptions.map(({ key, label }) => (
          <button
            key={key}
            className="people-btn"
            onClick={() => onSelect(key)}
          >
            <span className="people-icon">{icons[key]}</span>
            <span className="people-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
