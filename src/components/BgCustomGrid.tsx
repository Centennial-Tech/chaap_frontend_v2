import React, { useMemo } from "react";

interface IBgCustomSize {
  sm: string;
  md: string;
  lg: string;
}

type SizeKey = keyof IBgCustomSize;

interface IBgCustom {
  size: SizeKey;
  top: number;
  left: number;
}

const BG_CUSTOM_SIZE: IBgCustomSize = {
  sm: "50",
  md: "100",
  lg: "200",
};

const SIZES: SizeKey[] = ["sm", "md", "lg"];

const getRandomSize = (): SizeKey =>
  SIZES[Math.floor(Math.random() * SIZES.length)];

const isTooClose = (
  a: { top: number; left: number },
  b: { top: number; left: number },
  minDist = 15
) => {
  const dx = a.left - b.left;
  const dy = a.top - b.top;
  return Math.sqrt(dx * dx + dy * dy) < minDist;
};

const generateUniqueCards = (min: number, max: number): IBgCustom[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const cards: IBgCustom[] = [];

  while (cards.length < count) {
    const top = Math.max(40, Math.floor(Math.random() * 85));
    const left = Math.floor(Math.random() * 100);
    const size = getRandomSize();

    const tooClose = cards.some((c) =>
      isTooClose({ top, left }, { top: c.top, left: c.left }, 15)
    );

    if (!tooClose) cards.push({ top, left, size });
  }

  return cards;
};

const BgCustomCard: React.FC<IBgCustom> = ({ size, top, left }) => {
  return (
    <div
      className="flex gap-1 absolute z-[-1]"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${BG_CUSTOM_SIZE[size]}px`,
        transform: "translate(-50%, -50%)",
        opacity: 0.9,
      }}
    >
      <div
        className="w-[50%] delay-1000 duration-1000 shadow-2xl bg-gray-400 [clip-path:polygon(100%_0,0_0,0_100%,100%_75%)] rounded-xl p-4 sm:p-6 text-white transition-all rounded-bl-lg"
        style={{
          zIndex: -1,
          aspectRatio: 1,
        }}
      ></div>
      <div className="delay-1000">
        <div
          className="w-[50%] rotate-180 shadow-2xl bg-gray-400 [clip-path:polygon(100%_0,0_0,0_100%,100%_75%)] rounded-xl p-4 sm:p-6 text-white transition-all duration-300 rounded-bl-lg"
          style={{
            zIndex: -1,
            aspectRatio: 1,
          }}
        ></div>
      </div>
    </div>
  );
};

const BgCustomGrid = () => {
  const cards = useMemo(() => generateUniqueCards(6, 15), []);

  return (
    <div className="absolute w-full h-full overflow-hidden">
      {cards.map((card, i) => (
        <BgCustomCard key={i} {...card} />
      ))}
    </div>
  );
};

export default BgCustomGrid;
