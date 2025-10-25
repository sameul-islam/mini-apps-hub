
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";
import { useRef, useMemo } from "react";
import { Points as PointsType } from "three";

const StarField = () => {
  const ref = useRef<PointsType>(null);

  const sphere = useMemo(() => {
    const temp = random.inSphere(new Float32Array(10000 * 3), { radius: 1.6 }) as Float32Array;

    for (let i = 0; i < temp.length; i++) {
      if (isNaN(temp[i])) temp[i] = 0;
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02;
      ref.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.0025}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true }} dpr={[1, 2]}>
        <StarField />
      </Canvas>
    </div>
  );
};

export default GlobalBackground;
