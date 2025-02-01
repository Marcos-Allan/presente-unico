
import { Canvas } from "@react-three/fiber";
import { Experience } from "../../components/Experience";

export default function Model3D() {
    return (
        <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }} className={`w-[100vw] h-[100vh] flex items-center bg-red-600`}>
            <color attach="background" args={["#ececec"]} />
            <Experience />
        </Canvas>
    )
}