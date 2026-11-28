import type { Metadata } from "next";
import Cinematic3DExperience from "@/components/Cinematic3DExperience";

export const metadata: Metadata = {
  title: "Explore Lado Organics in 3D | Lado Love Pure",
  description: "Step into the Lado Organics world. Explore the farm and discover our live product collection in an immersive experience.",
};

export default function Experience3DPage() {
  return <Cinematic3DExperience />;
}
