import type { Metadata } from "next";
import CinematicEditorialPage from "@/components/CinematicEditorialPage";
export const metadata: Metadata = { title: "Gau Seva | Lado Organics", description: "Explore Lado Organics' cattle-care philosophy and verified updates." };
export default function GauSevaPage() {
 return <CinematicEditorialPage eyebrow="CARE, RESPONSIBILITY & TRADITION" title="A thoughtful place for Gau Seva." intro="Cattle are an important part of the agricultural and cultural traditions connected to Lado Organics. This page is a place to share our philosophy and verified updates with clarity and respect." sceneLabel="GAU SEVA" sceneNote="Care is an ongoing responsibility" cards={[
 {eyebrow:"01 · PHILOSOPHY",title:"Respect and responsibility",body:"Our approach starts with respect for animals and the responsibilities that come with their care. Specific care practices should be understood from documented farm information."},
 {eyebrow:"02 · TRANSPARENCY",title:"Share what can be verified",body:"This space is for genuine updates and photographs when available. We do not publish invented animal counts, impact numbers or unsupported welfare claims."},
 {eyebrow:"03 · STAY CONNECTED",title:"Ask before you contribute",body:"For questions about initiatives or ways to support, contact the Lado team directly. No donation or payment action is offered here unless a verified workflow is available."}
 ]} closingTitle="Questions about Gau Seva?" closingText="Speak with our team for current information about initiatives and verified updates." />;
}
