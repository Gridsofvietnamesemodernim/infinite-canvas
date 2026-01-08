import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import styles from "./style.module.css";

/* FIX: We changed 'export default function' to 'export function' 
   This matches what your project expects.
*/
export function App() {
  return (
    <>
      {/* I removed <Leva /> completely. 
         This fixes the "Module not found" error and cleans up the UI.
      */}
      
      <div className={styles.canvas}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Canvas>
      </div>
    </>
  );
}
