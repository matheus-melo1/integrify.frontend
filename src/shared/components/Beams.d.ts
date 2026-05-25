import type { ForwardRefExoticComponent, RefAttributes, CSSProperties } from "react";

export interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
  className?: string;
  style?: CSSProperties;
}

declare const Beams: ForwardRefExoticComponent<BeamsProps & RefAttributes<HTMLDivElement>>;
export default Beams;
