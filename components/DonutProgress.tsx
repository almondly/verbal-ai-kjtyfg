
import Svg, { Circle } from 'react-native-svg';
import { View } from 'react-native';
import { colors } from '../styles/commonStyles';

interface Props {
  size: number;
  strokeWidth: number;
  progress: number; // 0..1
}

export default function DonutProgress({ size, strokeWidth, progress }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamp = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clamp);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.success}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
    </View>
  );
}
