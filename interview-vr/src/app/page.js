"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the VR Interview Platform</h1>
      <Link href="/interview-room">Go to Interview Room</Link>
    </div>
  );
}
