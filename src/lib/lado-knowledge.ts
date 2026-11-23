import { db } from "@/lib/db";

export type KnowledgeEntry = {
  id?: string;
  category: string;
  title: string;
  question_patterns: string;
  answer: string;
};

export const DEFAULT_LADO_KNOWLEDGE: KnowledgeEntry[] = [
  {category:"brand",title:"About Lado Organics",question_patterns:"what is lado organics | tell me about lado | about lado | lado organics kya hai | lado kya hai",answer:"Lado Organics is a farm-rooted brand based in Pilani, Rajasthan. Its farm story focuses on indigenous Tharparkar cattle, traditional product making and a connected farm ecosystem. Explore the farm story on the website for the details currently shared by the team."},
  {category:"farm",title:"Farm and Tharparkar cattle",question_patterns:"what cows do you have | tharparkar cow | tell me about your cows | farm animals | tharparkar gai | गाय | थारपारकर गाय",answer:"Lado's farm story features indigenous Tharparkar cattle. The website also describes how farm resources such as cow dung can be used in a wider cycle that includes biogas, vermicomposting, soil and trees. For specific animal-care routines or herd details, please ask the farm team rather than relying on assumptions."},
  {category:"product",title:"A2 Bilona Ghee process",question_patterns:"how is bilona ghee made | bilona process | how do you make ghee | ghee making | ghee kaise banta hai | घी कैसे बनता है",answer:"The process described on the Lado website is: milk is heated, curd is formed, the curd is churned using a traditional wooden Bilona, butter is separated, and the butter is slowly heated to make ghee. Batch-specific details should be checked against that product's label or batch record."},
  {category:"product",title:"Ghee storage",question_patterns:"how to store ghee | ghee storage | where should i keep ghee | ghee kaise rakhe | घी कैसे रखें",answer:"Follow the storage instructions printed on the specific Lado product label. Keep the container clean and tightly closed, and use a clean, dry utensil. If the label gives different instructions, follow the label."},
  {category:"product",title:"Vermicompost information",question_patterns:"what is vermicompost | what is kechua khad | how is compost made | vermi compost | kechua khad kya hai | वर्मी कम्पोस्ट | केंचुआ खाद",answer:"Vermicompost is organic material processed with the help of earthworms. Lado's farm story describes vermicomposting as part of its farm-resource cycle. For exact composition, nutrient analysis, application rate or suitability for a particular crop, use the product label or ask the farm team; Lado AI should not invent those specifications."},
  {category:"product",title:"How to use vermicompost",question_patterns:"how to use vermicompost | how much compost for plants | compost application | khad kaise dale | खाद कैसे डालें",answer:"The right amount depends on the plant, soil, pot size and the product's actual composition. Start with the directions on the Lado product packaging. If no application rate is printed, ask the farm team before applying it to a large area."},
  {category:"product",title:"Dhoop usage",question_patterns:"how to use dhoop | how to burn dhoop | dhoop kaise jalaye | धूप कैसे जलाएं",answer:"Use the dhoop according to the instructions on its packaging. Burn it only in a suitable heat-resistant holder, on a stable surface, with good ventilation, and keep it away from children, pets and flammable materials. Never leave burning dhoop unattended."},
  {category:"shopping",title:"Current product prices and stock",question_patterns:"what is the price | product price | how much does it cost | is it available | do you have stock | price kya hai | kitne ka hai",answer:"I can check the live store catalogue for listed product prices and available pack sizes. Please tell me which product you are interested in. Final availability, shipping charges and delivery timing are confirmed by the Lado team."},
  {category:"delivery",title:"Shipping and delivery",question_patterns:"how long delivery takes | delivery charges | shipping charges | do you deliver | delivery kab hogi | shipping kaise hoti hai",answer:"Shipping fees, courier partner and dispatch timing are confirmed for each order based on the delivery PIN code and the current batch packaging schedule in Pilani, Rajasthan. Please share your product and PIN code with the team for a reliable estimate. I cannot promise a delivery date."},
  {category:"payment",title:"Payment methods",question_patterns:"how can i pay | payment methods | upi payment | cash on delivery | how to pay | payment kaise kare",answer:"The website may offer Cash on Delivery and manual UPI options at checkout, depending on current availability. For manual UPI, the Lado team must verify the payment before it is treated as received. Never share your UPI PIN, OTP or banking password with anyone."},
  {category:"payment",title:"Manual UPI verification",question_patterns:"i paid by upi | upi payment done | payment verification | i have transferred money | payment pending",answer:"A manual UPI transfer is not marked as received until the Lado team verifies it. Keep your transaction reference for the team. Never share your UPI PIN, OTP or banking password. If the payment status does not update, contact Lado support."},
  {category:"booking",title:"Bhunga stay price and booking",question_patterns:"bhunga stay price | how to book bhunga | stay booking | book a stay | bhunga kitne ka hai | भुंगा बुकिंग",answer:"The website lists a Bhunga stay base rate of ₹4,000 per night. Availability, dates, meals, guest limits and add-on prices must be confirmed by the Lado team. Submitting the stay form sends a request; it does not confirm a booking. Start from the Bhunga stay section on the website."},
  {category:"booking",title:"Farm experience",question_patterns:"farm experience | activities at farm | build my own experience | farm visit | farm activities",answer:"The Build Your Own Farm Experience section lets visitors combine Bhunga nights with selected activities. The displayed base stay estimate does not include custom workshop or meal pricing; the host confirms those details. Submitting an enquiry is a request, not a confirmed reservation."},
  {category:"sponsorship",title:"Gau Seva sponsorship",question_patterns:"how does gau seva work | sponsor a cow | cow sponsorship | gau seva | adopt a cow | गाय सेवा",answer:"The website's Gau Seva form currently offers Dholi Sheri, Tara and Roshni, with one-time, monthly or yearly plan choices and a contribution amount entered by the supporter. A form submission is an enquiry, not proof of payment or an adoption. The team can confirm the current arrangements."},
  {category:"essentials",title:"Essentials Club",question_patterns:"what is essentials club | repeat delivery | subscription | monthly product delivery",answer:"The Essentials Club and future-product interest forms currently record interest only. They are not paid subscriptions, pre-orders, scheduled deliveries or automatic renewals."},
  {category:"quality",title:"Lab reports and certifications",question_patterns:"do you have lab report | test report | certificate | certified organic | lab tested | fssai",answer:"The website FAQ says a laboratory report is shown only when an approved report is attached to the relevant batch record. I cannot claim a product has a certification or test report unless the relevant current document is available. Please ask the team about the specific product and batch."},
  {category:"account",title:"Sign in and order history",question_patterns:"where is my order | track my order | order history | how to login | sign in | mera order | order status",answer:"Use Google sign-in with the same Google account used when placing the order. Then open My Account or Order History from the customer dashboard. If you used a different email, sign in with that account. Lado AI must not reveal another customer's order information."},
  {category:"returns",title:"Returns and cancellations",question_patterns:"return policy | refund policy | cancel my order | how to return | refund | order cancellation",answer:"The Policies & Legal page currently contains draft templates marked as requiring legal review, so it should not be treated as a finalized legal guarantee. For a specific order cancellation, return or refund request, contact the Lado team with your order number."},
  {category:"support",title:"Contact Lado Organics",question_patterns:"contact customer care | talk to human | speak to team | whatsapp number | customer support | help number",answer:"You can contact the Lado Organics team on WhatsApp at +91 96361 00337, or use the Contact & Support page on the website. Please do not send passwords, OTPs or UPI PINs."},
  {category:"privacy",title:"AI privacy and safe information",question_patterns:"is lado ai safe | does ai store my data | can i share otp | privacy chat",answer:"Please do not share passwords, OTPs, UPI PINs, card details or other sensitive information in Lado AI chat. Messages may be processed by an external AI service when AI assistance is used. See the website's privacy information for the current disclosure."}
];

function normalize(value: string): string {
  return value.toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\u0900-\u097f]+/g," ").trim();
}

export function findLocalAnswer(question: string, entries: KnowledgeEntry[] = DEFAULT_LADO_KNOWLEDGE): KnowledgeEntry | null {
  const q = normalize(question);
  if (!q) return null;
  const qTokens = new Set(q.split(/\s+/).filter((t) => t.length > 2));
  let best: { entry: KnowledgeEntry; score: number } | null = null;
  for (const entry of entries) {
    const patterns = entry.question_patterns.split("|").map((p) => normalize(p)).filter(Boolean);
    let score = 0;
    for (const pattern of patterns) {
      if (q === pattern || q.includes(pattern) || pattern.includes(q)) score = Math.max(score, 1);
      else {
        const tokens = pattern.split(/\s+/).filter((t) => t.length > 2);
        if (!tokens.length) continue;
        const overlap = tokens.filter((t) => qTokens.has(t)).length / tokens.length;
        const questionCoverage = tokens.filter((t) => qTokens.has(t)).length / Math.max(1, qTokens.size);
        score = Math.max(score, overlap * 0.72 + questionCoverage * 0.28);
      }
    }
    if (!best || score > best.score) best = { entry, score };
  }
  return best && best.score >= 0.78 ? best.entry : null;
}

export async function getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  try {
    const result = await db.query(
      "SELECT id::text, category, title, question_patterns, answer FROM ai_knowledge WHERE is_published=TRUE ORDER BY sort_order ASC, updated_at DESC LIMIT 200"
    );
    const custom = result.rows as KnowledgeEntry[];
    return [...custom, ...DEFAULT_LADO_KNOWLEDGE];
  } catch (error) {
    console.warn("Lado AI knowledge table unavailable; using built-in verified knowledge:", error);
    return DEFAULT_LADO_KNOWLEDGE;
  }
}
