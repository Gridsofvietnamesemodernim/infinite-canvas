import { Canvas } from "@react-three/fiber";
// FIX: Changing 'components/Experience' to 'infinite-canvas' to match your folder
import { Experience } from "../infinite-canvas"; 
import styles from "./style.module.css";

export function App() {
  return (
    <>
      <div className={styles.canvas}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Canvas>
      </div>
    </>
  );
}
