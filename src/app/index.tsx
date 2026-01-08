import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";

function App() {
  return (
    <>
      <Leva hidden />
      {/* The 3D Canvas Scene */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
      
      {/* I have removed the <div className="frame"> section here.
         Now only the Canvas remains.
      */}
    </>
  );
}

export default App;
