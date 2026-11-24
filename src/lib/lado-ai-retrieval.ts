export type RetrievalEntry = {
  category: string;
  title: string;
  question_patterns: string;
  answer: string;
};

const STOP_WORDS = new Set([
  "a","an","the","is","are","am","was","were","be","been","being","do","does","did","can","could","would","should",
  "i","me","my","we","our","you","your","yours","they","them","their","it","its","this","that","these","those",
  "what","which","who","when","where","why","how","tell","show","please","kindly","about","for","of","to","from",
  "in","on","at","with","and","or","as","by","please","mujhe","mujhko","mai","main","mein","aap","aapko","aapki",
  "kya","kaise","kaisa","kaisi","kitna","kitne","kitni","kahan","kab","hai","hain","ho","hoga","hogi","honge",
  "ka","ki","ke","ko","se","par","me","mera","meri","mere","hamara","hamari","hamare","batao","bataye","bataiye",
  "thoda","aur","kuch","koi","kya","kripya","krdo","karo","karna","karu","karun","kar",
]);

const TOKEN_CANONICAL: Record<string, string> = {
  ghi: "ghee", ghii: "ghee", ghee: "ghee", gheee: "ghee", घी: "ghee", घीया: "ghee",
  dhoopbatti: "dhoop", dhoop: "dhoop", incense: "dhoop", धूप: "dhoop", धूपबत्ती: "dhoop",
  khaad: "khad", khad: "khad", compost: "khad", vermicompost: "khad", kechua: "khad", kechuaa: "khad",
  खाद: "khad", केंचुआ: "khad", "वर्मी": "khad", "कम्पोस्ट": "khad",
  order: "order", orders: "order", ordering: "order", buy: "order", buying: "order", purchase: "order",
  shopping: "order", shop: "order", checkout: "order", मंगवाना: "order", ऑर्डर: "order", खरीदना: "order",
  delivery: "delivery", shipping: "delivery", dispatch: "delivery", courier: "delivery", डिलीवरी: "delivery",
  refund: "refund", refunds: "refund", return: "refund", returns: "refund", cancellation: "refund", cancel: "refund",
  price: "price", prices: "price", cost: "price", rate: "price", rates: "price", bhav: "price", bhaav: "price",
  daam: "price", dam: "price", कीमत: "price", दाम: "price", भाव: "price", मूल्य: "price",
  stay: "stay", bhunga: "stay", booking: "stay", book: "stay", ठहराव: "stay", भुंगा: "stay", रुकना: "stay",
  cow: "cow", cows: "cow", cattle: "cow", gai: "cow", gaay: "cow", गाय: "cow", गायें: "cow", गायां: "cow",
  contact: "contact", support: "contact", help: "contact", whatsapp: "contact", सहायता: "contact", मदद: "contact",
  payment: "payment", payments: "payment", pay: "payment", upi: "payment", भुगतान: "payment", पैसा: "payment",
  farm: "farm", farming: "farm", खेत: "farm", खेतरी: "farm",
  sponsor: "sponsorship", sponsorship: "sponsorship", adopt: "sponsorship", seva: "sponsorship", सेवा: "sponsorship",
  privacy: "privacy", सुरक्षित: "privacy", सुरक्षा: "privacy",
};

function normalize(value: string): string {
  return value.toLocaleLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0900-\u097f]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => TOKEN_CANONICAL[token] || token)
    .join(" ");
}

function meaningfulTokens(value: string): string[] {
  return normalize(value).split(/\s+/).filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

const EXPANDED_QUESTION_PATTERNS: Record<string, string[]> = {
  "About Lado Organics": [
    "what does lado do", "lado brand story", "lado company information", "lado organics introduction", "tell me about lado organics", "lado kya hai organics",
    "lado kya hai", "lado ke hai", "lado ka parichay", "lado ke baare mein batao", "lado ke bare me bataiye",
    "lado su hai", "lado ro parichay", "tharo lado su hai", "lado ke che", "lado shu che",
    "लाडो ऑर्गेनिक्स क्या है", "लाडो के बारे में बताइए", "लाडो की कहानी",
  ],
  "Farm and Tharparkar cattle": [
    "tell me about tharparkar cows", "which breed of cows", "what cattle are on the farm", "farm cow breed",
    "tharparkar gai", "tharparkar gaay", "thari gai", "thari gaay", "gaay kaisi hai", "cow breed",
    "थारपारकर गाय", "आपके खेत में कौन सी गाय है", "गायों के बारे में बताओ",
  ],
  "A2 Bilona Ghee process": [
    "how do you prepare ghee", "how is lado ghee prepared", "how is ghee produced", "ghee manufacturing process",
    "bilona method", "traditional ghee making", "ghee kaise banta hai", "ghee kaise banate hain",
    "ghino kaiso bane", "ghee kiyan bane", "ghee kaiso banyo", "bilona ri reet",
    "घी बनाने की विधि", "बिलोना विधि क्या है", "आपका घी कैसे बनता है",
  ],
  "Ghee storage": [
    "how should i keep ghee", "how do i preserve ghee", "ghee shelf storage", "store ghee after opening",
    "ghee kaise rakhe", "ghee kithai rakhu", "ghino rakhan ro tariko", "घी को कैसे रखें", "घी रखने का तरीका",
  ],
  "Vermicompost information": [
    "tell me about compost", "what is earthworm manure", "what is organic manure", "how vermicompost is made",
    "kechua khad su hai", "khad kiyan bane", "khad ro upyog", "केंचुआ खाद क्या है", "वर्मी कम्पोस्ट क्या होता है",
  ],
  "How to use vermicompost": [
    "how much manure should i use", "compost dosage for plants", "how to apply organic manure", "fertilizer for pots",
    "khad kitri nakhu", "paudha mein khad kitti nakhu", "khad kiyan dalu", "खाद कितनी डालें", "पौधों में खाद कैसे डालें",
  ],
  "Dhoop usage": [
    "how to use incense", "how to burn incense safely", "how do i light dhoop", "dhoop use instructions", "dhoop safety",
    "dhoop kiyan jalau", "dhoop kaiso jalave", "धूप कैसे जलाएं", "धूप जलाने का तरीका",
  ],
  "Current product prices and stock": [
    "show current prices", "how much are your products", "which products are in stock", "available pack sizes",
    "kitro bhav hai", "kito ro hai", "tharo bhav su hai", "saman kitro ko", "किस सामान का कितना दाम है",
  ],
  "Cow dung and circular farm practices": [
    "how is cow dung reused", "what happens to farm waste", "biogas and compost process", "cow dung management",
    "gobar su karo ho", "gobar ro upyog", "gobar kithai kaam ave", "गोबर का क्या उपयोग करते हैं",
  ],
  "Product health and medical claims": [
    "is ghee a medicine", "can ghee cure illness", "does this product treat disease", "health cure claims",
    "ghee bimari thik kare", "ghee dava hai ke", "घी बीमारी ठीक करता है क्या", "क्या यह बीमारी ठीक करता है",
  ],
  "How to place an order": [
    "how can i purchase products", "how to buy from website", "place an order online", "buy something from lado",
    "saman kiyan mangwau", "order kiyan karu", "mhaane saman mangvano hai", "ऑनलाइन सामान कैसे मंगाएं",
  ],
  "Shipping and delivery": [
    "when will my parcel arrive", "delivery time to my pincode", "shipping cost", "do you ship to my city",
    "saman kadi avse", "ghar kadi pahunche", "delivery kadi avse", "सामान कब पहुंचेगा", "डिलीवरी में कितना समय",
  ],
  "Payment methods": [
    "how do i make payment", "what payment options are available", "can i pay by upi", "cash on delivery",
    "paisa kiyan devu", "bhugtan kiyan karu", "upi kiyan karu", "भुगतान कैसे करें", "कौन से पेमेंट विकल्प",
  ],
  "Manual UPI verification": [
    "i sent the upi payment", "payment transferred but not updated", "verify my transaction", "upi payment pending",
    "upi kari didho", "paisa mokli didha", "payment kari didho", "यूपीआई से पैसे भेज दिए", "पेमेंट वेरिफाई करें",
  ],
  "Bhunga stay price and booking": [
    "how much does bhunga cost", "book a farm stay", "stay room availability", "nightly stay rate",
    "bhunga ro bhav", "bhunga mein kiyan rukhu", "bhunga booking kiyan karu", "भुंगा स्टे का किराया", "रहने की बुकिंग",
  ],
  "Farm experience": [
    "what can visitors do on farm", "farm tour activities", "visit the farm", "custom farm experience",
    "khet ro anubhav", "farm ghumno hai", "khet ghumna hai", "खेत घूमने का अनुभव", "फार्म पर क्या कर सकते हैं",
  ],
  "Gau Seva sponsorship": [
    "how can i support cows", "sponsor a calf", "support gaushala", "gau seva contribution",
    "gau seva kiyan karu", "gai ri seva kiyan karu", "bachhri god levani hai", "गौ सेवा कैसे करें", "गाय को गोद लेना",
  ],
  "Essentials Club": [
    "monthly essentials delivery", "is this a subscription", "is this a subscription plan", "recurring order plan", "essentials membership",
    "essentials club su hai", "mahinavari saman avse ke", "क्या यह पेड सब्सक्रिप्शन है",
  ],
  "Lab reports and certifications": [
    "is the product certified", "show quality test report", "is there a lab certificate", "organic certification proof",
    "lab report hai ke", "certificate hai ke", "janch report dikhao", "क्या लैब रिपोर्ट उपलब्ध है", "क्या यह प्रमाणित है",
  ],
  "Sign in and order history": [
    "where can i see my purchases", "track my order", "my order status", "view order history",
    "mharo order kithai hai", "mharo order kiyan dekhu", "order kithai dekhno", "मेरा ऑर्डर कहाँ है", "ऑर्डर की स्थिति",
  ],
  "Returns and cancellations": [
    "how do i get a refund", "return a product", "cancel my purchase", "money back request",
    "order cancel kiyan karu", "paisa wapas kiyan male", "saman wapas kiyan karu", "ऑर्डर वापस कैसे करें", "रिफंड कैसे मिलेगा",
  ],
  "Contact Lado Organics": [
    "how can i contact the team", "customer care phone number", "talk to a real person", "need human assistance",
    "lado team su kiyan bolu", "thari team su bat karni", "madad kithai mile", "टीम से कैसे बात करें", "संपर्क नंबर बताइए",
  ],
  "Gau Seva contribution amount": [
    "minimum donation amount", "how much should i contribute", "is there a fixed sponsorship amount",
    "sponsorship amount", "gau seva price", "what is the calf sponsorship amount", "गौ सेवा में कितनी राशि देनी होगी",
  ],
  "AI privacy and safe information": [
    "is my chat private", "does lado ai save my information", "can i share my otp", "is it safe to tell upi pin",
    "otp devu ke", "upi pin batavu ke", "lado ai surakshit hai ke", "क्या ओटीपी बताना सुरक्षित है", "चैट की गोपनीयता",
  ],
};

export function findLocalAnswer(question: string, entries: RetrievalEntry[]): RetrievalEntry | null {
  const query = normalize(question);
  const queryTokens = meaningfulTokens(question);
  if (query.length < 3 || queryTokens.length < 2) return null;

  const ranked = entries.map((entry) => {
    const patterns = [
      ...entry.question_patterns.split("|"),
      entry.title,
      ...(EXPANDED_QUESTION_PATTERNS[entry.title] || []),
    ].map((pattern) => normalize(pattern)).filter(Boolean);

    let score = 0;
    for (const pattern of patterns) {
      if (query === pattern) {
        score = 1;
        break;
      }
      if (query.length >= 8 && (query.includes(pattern) || pattern.includes(query))) {
        score = Math.max(score, 0.96);
        continue;
      }
      const patternTokens = meaningfulTokens(pattern);
      if (patternTokens.length < 2) continue;
      const querySet = new Set(queryTokens);
      const patternSet = new Set(patternTokens);
      const overlap = queryTokens.filter((token) => patternSet.has(token)).length;
      const queryCoverage = overlap / querySet.size;
      const patternCoverage = overlap / patternSet.size;
      const scoreForPattern = queryCoverage * 0.78 + patternCoverage * 0.22;
      score = Math.max(score, scoreForPattern);
    }
    return { entry, score };
  }).sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const runnerUp = ranked[1];
  if (!best || best.score < 0.70) return null;
  if (runnerUp && best.score - runnerUp.score < 0.06) return null;
  return best.entry;
}
