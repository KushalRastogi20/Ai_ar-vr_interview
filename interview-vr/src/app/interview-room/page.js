"use client";
import { useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";

function RoomModel() {
  const gltf = useLoader(GLTFLoader, "/models/room.glb");
  return <primitive object={gltf.scene} scale={0.5} position={[0, -1, 0]} />;
}

export default function InterviewRoom() {
  return (
    <div>
      <h1>VR Interview Room</h1>
      <Canvas style={{ height: "100vh" }} camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RoomModel />
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}
