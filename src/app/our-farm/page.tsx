import type { Metadata } from "next";
import CinematicEditorialPage from "@/components/CinematicEditorialPage";
export const metadata: Metadata = { title: "Our Farm | Lado Organics", description: "Discover the farm roots and Rajasthan setting behind Lado Organics in Pilani." };
export default function OurFarmPage() {
 return <CinematicEditorialPage eyebrow="THE PLACE BEHIND THE PROMISE" title="A story rooted in the land." intro="Lado Organics is rooted in Pilani, Rajasthan. Our farm story brings together the place, traditional knowledge, animal care and the products that form our collection." sceneLabel="PILANI · RAJASTHAN" sceneNote="A living connection to the land" cards={[
 {eyebrow:"01 · PLACE",title:"Rooted in Pilani",body:"Our story begins in Pilani, Rajasthan. The landscape and local traditions are part of the identity we carry into the Lado Organics experience."},
 {eyebrow:"02 · ANIMAL CARE",title:"Respect for the cattle",body:"Cattle and dairy are part of the Lado story. We share specific practices only when they are documented and verified."},
 {eyebrow:"03 · CONNECTION",title:"From farm story to everyday life",body:"Explore the live collection, learn about the methods described for each product, and use batch traceability whenever a batch record is available."}
 ]} closingTitle="Come closer to the Lado story." closingText="Explore the current collection or contact our team for verified product and farm information." />;
}
