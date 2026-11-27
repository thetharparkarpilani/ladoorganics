import type { Metadata } from "next";
import CinematicEditorialPage from "@/components/CinematicEditorialPage";
export const metadata: Metadata = { title: "Our Process | Lado Organics", description: "Learn how Lado Organics presents product-specific sourcing and traditional process information." };
export default function OurProcessPage() {
 return <CinematicEditorialPage eyebrow="CARE IN EVERY DETAIL" title="Tradition, with transparency." intro="Different products have different origins, ingredients and methods. We present the information relevant to each product rather than suggesting that one process applies to everything." sceneLabel="MADE WITH INTENTION" sceneNote="Every product has its own story" cards={[
 {eyebrow:"01 · UNDERSTAND",title:"Know the product",body:"Start with the live catalogue and product detail page for the current description, available variants, listed price and availability."},
 {eyebrow:"02 · PRODUCT-SPECIFIC",title:"Methods matter",body:"Traditional Bilona preparation, dhoop making and vermicompost are distinct activities. Refer to the relevant product information for the method and usage details that apply."},
 {eyebrow:"03 · VERIFY",title:"Follow the batch",body:"Where a batch record exists, use traceability to view the information recorded for that batch. We do not invent laboratory results, certifications or production details."}
 ]} closingTitle="The details deserve to be clear." closingText="Visit a product page for its current details, or check a batch record when you have its code." />;
}
