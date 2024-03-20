import React from 'react';

export const PlusIcon = ({ color, size }: { color?: string; size?: number }) => {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={color}
        stroke-width="2"
      />
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
