import { Canvas } from "@react-three/fiber";
// FIX 1: I changed 'Experience' to 'InfiniteCanvas'
// FIX 2: I removed the curly braces { } in case it is a default export. 
// If this fails, we will put the braces back.
import InfiniteCanvas from "../infinite-canvas"; 
import styles from "./style.module.css";

export function App() {
  return (
    <>
      <div className={styles.canvas}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={["#ececec"]} />
          {/* FIX 3: Updated the tag name here too */}
          <InfiniteCanvas />
        </Canvas>
      </div>
    </>
  );
}
