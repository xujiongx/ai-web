import React from 'react';
import styles from './index.module.less';

const FestivalDecorations: React.FC = () => {
  return (
    <div className={styles.decorations}>
      <div className={styles.lanternLeft}>
        <svg viewBox="0 0 100 160" className={styles.lantern}>
          <path className={styles.lanternString} d="M50,0 V30" />
          <path className={styles.lanternBody} d="M20,40 Q50,20 80,40 L80,120 Q50,140 20,120 Z" />
          <path className={styles.lanternTop} d="M35,30 H65 L60,40 H40 Z" />
          <path className={styles.lanternBottom} d="M30,120 Q50,140 70,120 L65,130 Q50,145 35,130 Z" />
          <text x="50" y="85" className={styles.lanternText}>福</text>
        </svg>
      </div>
      <div className={styles.lanternRight}>
        <svg viewBox="0 0 100 160" className={styles.lantern}>
          <path className={styles.lanternString} d="M50,0 V30" />
          <path className={styles.lanternBody} d="M20,40 Q50,20 80,40 L80,120 Q50,140 20,120 Z" />
          <path className={styles.lanternTop} d="M35,30 H65 L60,40 H40 Z" />
          <path className={styles.lanternBottom} d="M30,120 Q50,140 70,120 L65,130 Q50,145 35,130 Z" />
          <text x="50" y="85" className={styles.lanternText}>禄</text>
        </svg>
      </div>
      <div className={styles.firecracker}>
        <svg viewBox="0 0 100 100">
          <g className={styles.firecrackerGroup}>
            <path className={styles.firecrackerBody} d="M45,30 h10 v40 h-10 z" />
            <circle className={styles.fuse} cx="50" cy="25" r="2" />
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                className={styles.spark}
                cx={50 + Math.cos((i * Math.PI) / 4) * 20}
                cy={50 + Math.sin((i * Math.PI) / 4) * 20}
                r="3"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FestivalDecorations;