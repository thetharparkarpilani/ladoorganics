import type { LocaleCode } from "@/types/domain";

export type LadoLocale = LocaleCode;

export const LANGUAGE_LABELS: Record<LadoLocale, string> = {
  en: "English",
  hi: "हिन्दी",
  ma: "मारवाड़ी",
};

export const AI_COPY: Record<LadoLocale, {
  welcome: string; launcher: string; close: string; subtitle: string; newChat: string;
  startersTitle: string; orders: string; orderStatus: string; payment: string;
  total: string; addToBag: string; add: string; placeholder: string; send: string;
  footer: string; humanSupport: string; whatsapp: string; fallback: string;
  connectionError: string; thinking: string; added: (product: string, variant: string) => string;
  orderIntro: string; noOrders: string;
}> = {
  en: {
    welcome: "Namaste! 🌿 I’m Lado AI. Ask me about our products, listed prices, farm practices, Bhunga stays, Gau Seva, orders, payments or any part of this website. I’ll be clear when something needs confirmation.",
    launcher: "Ask Lado AI", close: "Close", subtitle: "Your Lado Organics guide · Pilani",
    newChat: "New chat", startersTitle: "WHAT CAN I HELP YOU WITH?", orders: "Show my recent orders",
    orderStatus: "Status", payment: "Payment", total: "Total", addToBag: "ADD TO YOUR BAG",
    add: "Add +", placeholder: "Ask me in English, हिन्दी or मारवाड़ी…", send: "Send message",
    footer: "AI can make mistakes. Never share OTPs, passwords or UPI PINs.", humanSupport: "Human support",
    whatsapp: "WhatsApp", thinking: "Lado AI is thinking",
    added: (product, variant) => `Added ${product} (${variant}) to your bag. Open your bag to review it before checkout.`,
    orderIntro: "Here are your latest orders from your signed-in Lado account. This information is private to your account.",
    noOrders: "I couldn't find orders linked to this Google account. Sign in with the same account used at checkout or contact our team.",
    connectionError: "Connection issue. Please try again.",
    fallback: "I don't have a verified answer to that yet. I can still guide you to the right page or connect you with our Pilani team.",
  },
  hi: {
    welcome: "नमस्ते! 🌿 मैं Lado AI हूँ। आप मुझसे उत्पादों, कीमतों, खेत की प्रक्रिया, भुंगा स्टे, गौ सेवा, ऑर्डर, भुगतान या वेबसाइट के किसी भी हिस्से के बारे में पूछ सकते हैं। जहाँ पुष्टि ज़रूरी होगी, मैं साफ़ बता दूँगा।",
    launcher: "Lado AI से पूछें", close: "बंद करें", subtitle: "पिलानी से Lado Organics की मदद",
    newChat: "नई बातचीत", startersTitle: "मैं आपकी क्या मदद करूँ?", orders: "मेरे हाल के ऑर्डर दिखाएँ",
    orderStatus: "स्थिति", payment: "भुगतान", total: "कुल", addToBag: "अपने बैग में जोड़ें",
    add: "जोड़ें +", placeholder: "हिंदी, मारवाड़ी या English में पूछें…", send: "संदेश भेजें",
    footer: "AI से गलती हो सकती है। OTP, पासवर्ड या UPI PIN कभी साझा न करें।", humanSupport: "टीम से बात करें",
    whatsapp: "व्हाट्सऐप", thinking: "Lado AI जवाब तैयार कर रहा है",
    added: (product, variant) => `${product} (${variant}) आपके बैग में जोड़ दिया गया है। चेकआउट से पहले बैग में जाँच लें।`,
    orderIntro: "आपके साइन-इन किए हुए Lado खाते के हाल के ऑर्डर नीचे हैं। यह जानकारी केवल आपके खाते की है।",
    noOrders: "इस Google खाते से जुड़े ऑर्डर नहीं मिले। चेकआउट में इस्तेमाल किए गए उसी खाते से साइन इन करें या हमारी टीम से संपर्क करें।",
    connectionError: "कनेक्शन में समस्या है। कृपया फिर कोशिश करें।",
    fallback: "इस सवाल का पक्का जवाब अभी मेरे पास नहीं है। मैं आपको सही पेज तक पहुँचा सकता हूँ या पिलानी की टीम से जोड़ सकता हूँ।",
  },
  ma: {
    welcome: "खम्मा घणी! 🌿 म्हूं Lado AI हूँ। थां सामान, भाव, खेत री रीति, भुंगा रै ठहराव, गौ सेवा, ऑर्डर, भुगतान अर वेबसाइट रा बारे में पूछ सको हो। जठै पक्की जानकारी जरूरी होवै, म्हूं साफ-साफ बताऊँला।",
    launcher: "Lado AI सूं पूछो", close: "बंद करो", subtitle: "पिलानी सूं Lado Organics री मदद",
    newChat: "नवीं बात", startersTitle: "म्हूं थारी काई मदद करूं?", orders: "म्हारा हाल रा ऑर्डर देखाओ",
    orderStatus: "हाल", payment: "भुगतान", total: "कुल", addToBag: "थैली में जोड़ो",
    add: "जोड़ो +", placeholder: "मारवाड़ी, हिंदी या English में पूछो…", send: "संदेश भेजो",
    footer: "AI सूं भूल हो सके। OTP, पासवर्ड अर UPI PIN कदी मत बतावो।", humanSupport: "टीम सूं बात करो",
    whatsapp: "व्हाट्सऐप", thinking: "Lado AI जवाब सोच रियो है",
    added: (product, variant) => `${product} (${variant}) थारी थैली में जुड़ गयो। चेकआउट सूं पैली थैली देख ल्यो।`,
    orderIntro: "थारे साइन-इन Lado खाते रा हाल रा ऑर्डर ई है। ई जानकारी बस थारे खाते री है।",
    noOrders: "ई Google खाते सूं जुड़्या ऑर्डर कोनी मिल्या। जिण खाते सूं ऑर्डर कर्यो थो, उणै सूं साइन-इन करो या म्हारी टीम नै खबर करो।",
    connectionError: "कनेक्शन में दिक्कत है। फेर कोशिश करो।",
    fallback: "ई सवाल रो पक्को जवाब म्हारे पास अभी कोनी है। म्हूं थाने सही पन्ने पर ले जासकूं हूँ या पिलानी री टीम सूं मिलवा सकूं हूँ।",
  },
};

type LocalizedAnswer = { en: string; hi: string; ma: string };
const ANSWERS: Record<string, LocalizedAnswer> = {
  "About Lado Organics": {
    en: "Lado Organics is a farm-rooted brand based in Pilani, Rajasthan. Its story brings together indigenous Tharparkar cattle, traditional making and a connected farm ecosystem. Explore the Farm Story section for the details shared by the team.",
    hi: "Lado Organics राजस्थान के पिलानी में स्थित खेत-आधारित ब्रांड है। इसकी कहानी में देसी थारपारकर गायें, पारंपरिक निर्माण और खेत का आपस में जुड़ा पारिस्थितिकी तंत्र शामिल है। टीम द्वारा साझा की गई जानकारी के लिए Farm Story देखें।",
    ma: "Lado Organics पिलानी, राजस्थान रो खेत-सूं जुड़्यो ब्रांड है। ई री बात में देसी थारपारकर गाय, पुरखां री बनावण री रीति अर खेत रो आपस में जुड़्यो चक्र आवै है। वधारे जाणवा खातर Farm Story देखो।",
  },
  "Farm and Tharparkar cattle": {
    en: "Lado's farm story features indigenous Tharparkar cattle. It also describes a farm-resource cycle involving cow dung, biogas, vermicomposting, soil and trees. For current herd details or animal-care routines, please confirm with the farm team.",
    hi: "Lado की खेत-कहानी में देसी थारपारकर गायें शामिल हैं। वेबसाइट पर गोबर, बायोगैस, केंचुआ खाद, मिट्टी और पेड़ों को जोड़ने वाली खेत-संसाधन प्रक्रिया भी बताई गई है। गायों की मौजूदा संख्या या देखभाल की जानकारी खेत की टीम से पक्की करें।",
    ma: "Lado री खेत री बात में देसी थारपारकर गायां है। वेबसाइट पर गोबर, बायोगैस, केंचुआ खाद, माटी अर रूंखां नै जोड़ती खेत री रीति बताई है। गायां री आज री जानकारी अर देखभाल खातर खेत री टीम सूं पूछो।",
  },
  "A2 Bilona Ghee process": {
    en: "The process described by Lado is: milk is heated, curd is set, the curd is churned with a traditional wooden Bilona, butter is separated, and the butter is slowly heated into ghee. Check the current product label or batch record for batch-specific details.",
    hi: "Lado द्वारा बताई गई प्रक्रिया में दूध गर्म किया जाता है, उससे दही जमाया जाता है, फिर लकड़ी की पारंपरिक बिलोना से दही मथा जाता है। मक्खन अलग करके धीमी आँच पर घी बनाया जाता है। किसी खास बैच की जानकारी के लिए उसका लेबल या बैच रिकॉर्ड देखें।",
    ma: "Lado री बताई रीति में पैली दूध गरम करै, फेर दही जमावै। दही नै लकड़ी री बिलोना सूं मथै, मक्खण अलग करै अर धीमी आंच पर घी बणावै। खास बैच री बात खातर उण रो लेबल या बैच रिकॉर्ड देखो।",
  },
  "Ghee storage": {
    en: "Follow the storage directions on the specific product label. Keep the container tightly closed and use a clean, dry spoon. If the label says something different, follow the label.",
    hi: "घी को उसी उत्पाद के लेबल पर दिए निर्देशों के अनुसार रखें। डिब्बा अच्छी तरह बंद रखें और साफ़, सूखा चम्मच इस्तेमाल करें। लेबल पर अलग निर्देश हों तो उन्हीं का पालन करें।",
    ma: "घी नै उणै डिब्बे रै लेबल पर लिख्या तरीका सूं राखो। डिब्बो कसकै बंद राखो अर साफ-सूखो चमचो लो। लेबल पर दूसरी बात लिखी होवै तो उणै मानो।",
  },
  "Vermicompost information": {
    en: "Vermicompost is organic material processed with the help of earthworms. Lado describes it as part of its farm-resource cycle. For exact composition, nutrient analysis or crop-specific suitability, follow the product label or ask the farm team.",
    hi: "वर्मी कम्पोस्ट जैविक सामग्री है जिसे केंचुओं की मदद से तैयार किया जाता है। Lado इसे खेत के संसाधनों के चक्र का हिस्सा बताता है। इसकी सही संरचना, पोषक तत्वों या किसी फसल के लिए उपयुक्त मात्रा के लिए उत्पाद का लेबल देखें या खेत की टीम से पूछें।",
    ma: "केंचुआ खाद जैविक चीजां नै केंचुआ री मदद सूं गलाव-बणाव कर तैयार करै है। Lado ई नै खेत रै संसाधन चक्र रो एक भाग बतावै है। खाद री असल बनावट, पोषक तत्व अर फसल खातर कितरी मात्रा लेणी, ई खातर लेबल देखो या खेत री टीम सूं पूछो।",
  },
  "How to use vermicompost": {
    en: "The right amount depends on the plant, soil, pot size and the product's actual composition. Start with the directions on the Lado product packaging. If no rate is printed, ask the farm team before using it on a large area.",
    hi: "खाद की सही मात्रा पौधे, मिट्टी, गमले के आकार और खाद की वास्तविक संरचना पर निर्भर करती है। Lado की पैकिंग पर दिए निर्देशों से शुरुआत करें। यदि मात्रा नहीं लिखी है, तो बड़े क्षेत्र में डालने से पहले खेत की टीम से पूछें।",
    ma: "खाद री सही मात्रा पौधा, माटी, गमलै रो आकार अर खाद री असल बनावट पर निर्भर है। Lado रै पैकेट पर लिख्या तरीका पैली देखो। मात्रा नहीं लिखी होवै तो मोठे खेत में डालण सूं पैली टीम सूं पूछो।",
  },
  "Dhoop usage": {
    en: "Use the dhoop according to its packaging. Burn it in a heat-resistant holder on a stable surface with good ventilation. Keep it away from children, pets and flammable items, and never leave it unattended.",
    hi: "धूप का इस्तेमाल पैकेट पर दिए निर्देशों के अनुसार करें। इसे गर्मी सहने वाले स्टैंड में, स्थिर जगह और अच्छी हवा वाले कमरे में जलाएँ। बच्चों, पालतू जानवरों और ज्वलनशील चीज़ों से दूर रखें; जलती धूप को अकेला न छोड़ें।",
    ma: "धूप नै पैकेट पर लिख्या तरीका सूं जलावो। गर्मी सहण वाले स्टैंड में, पक्की जगह अर हवा आवै-जावै ईंठै जलावो। बालकां, पशुवां अर आग पकड़ण वाली चीजां सूं दूर राखो; जलती धूप नै अकेली मत छोड़ो।",
  },
  "Current product prices and stock": {
    en: "I can check the live store for listed prices and pack sizes. Tell me which product you want to know about. Stock, shipping charges and delivery timing can change and must be confirmed at checkout or by the Lado team.",
    hi: "मैं स्टोर में दी गई मौजूदा कीमत और पैक का आकार देख सकता हूँ। बताइए आपको किस उत्पाद की जानकारी चाहिए। स्टॉक, डिलीवरी शुल्क और समय बदल सकते हैं; चेकआउट या Lado टीम से पुष्टि ज़रूर करें।",
    ma: "म्हूं स्टोर में चालू भाव अर पैक रो नाप देख सकूं हूँ। थां बतावो किण सामान री जानकारी चाहिजै। स्टॉक, भेजण रो खर्चो अर पहुंचण रो समय बदल सके; चेकआउट पर या Lado टीम सूं पक्को कर ल्यो।",
  },
  "How to place an order": {
    en: "Open the Store, choose a product and an available pack, add it to your bag, then continue to checkout. Review your details before submitting. An order request is not confirmed until the Lado team confirms it.",
    hi: "स्टोर खोलें, उत्पाद और उपलब्ध पैक चुनें, उसे बैग में जोड़ें और चेकआउट पर जाएँ। भेजने से पहले अपना विवरण जाँच लें। Lado टीम की पुष्टि होने तक ऑर्डर अनुरोध पक्का ऑर्डर नहीं है।",
    ma: "स्टोर खोलो, सामान अर मिलतो पैक चुनो, थैली में जोड़ो अर चेकआउट पर जावो। भेजण सूं पैली आपरी जानकारी देख ल्यो। Lado टीम री पुष्टि होवै तद ही ऑर्डर पक्को मानजो।",
  },
  "Shipping and delivery": {
    en: "Shipping fees, courier and dispatch timing are confirmed for each order using the delivery PIN code and current packing schedule in Pilani. I cannot promise a delivery date. Share your PIN code with the team for a reliable estimate.",
    hi: "डिलीवरी शुल्क, कूरियर और भेजने का समय आपके PIN कोड तथा पिलानी में पैकिंग की मौजूदा स्थिति के आधार पर तय होते हैं। मैं डिलीवरी की तारीख का वादा नहीं कर सकता। सही अनुमान के लिए टीम को अपना PIN कोड दें।",
    ma: "भेजण रो खर्चो, कूरियर अर रवाना करणी रो समय थारे PIN कोड अर पिलानी री चालू पैकिंग व्यवस्था पर तय होवै है। म्हूं पहुंचण री तारीख रो वादो कोनी कर सकूं। सही अंदाज खातर टीम नै PIN कोड बतावो।",
  },
  "Payment methods": {
    en: "Checkout may offer Cash on Delivery and manual UPI, depending on current availability. Manual UPI is marked received only after the Lado team verifies it. Never share your UPI PIN, OTP or banking password.",
    hi: "मौजूदा सुविधा के अनुसार चेकआउट में Cash on Delivery या मैन्युअल UPI मिल सकता है। UPI भुगतान को Lado टीम की जाँच के बाद ही प्राप्त माना जाता है। अपना UPI PIN, OTP या बैंक पासवर्ड कभी साझा न करें।",
    ma: "चालू सुविधा अनुसार चेकआउट में Cash on Delivery या हाथ सूं UPI रो विकल्प मिल सके। UPI रकम Lado टीम जांचै तद ही जमा मानै। आपरो UPI PIN, OTP या बैंक पासवर्ड कदी मत बतावो।",
  },
  "Bhunga stay price and booking": {
    en: "The website lists a Bhunga stay base rate of ₹4,000 per night. Dates, availability, meals, guest limits and add-ons must be confirmed by the team. Sending the form is a request, not a confirmed booking.",
    hi: "वेबसाइट पर भुंगा स्टे का शुरुआती किराया ₹4,000 प्रति रात दिया गया है। तारीख, उपलब्धता, भोजन, मेहमानों की सीमा और अतिरिक्त सुविधाओं की पुष्टि टीम करेगी। फ़ॉर्म भेजना केवल अनुरोध है, पक्की बुकिंग नहीं।",
    ma: "वेबसाइट पर भुंगा ठहराव रो शुरुआती भाव ₹4,000 एक रात रो लिख्यो है। तारीख, जगह खाली है कि कोनी, भोजन, मेहमानां री गिणती अर वधारी सुविधा टीम पक्की करैला। फॉर्म भरवो अरज है, पक्की बुकिंग कोनी।",
  },
  "Farm experience": {
    en: "Build Your Own Farm Experience lets visitors combine Bhunga nights with selected activities. Custom workshop and meal prices are confirmed by the host. An enquiry is not a confirmed reservation.",
    hi: "Build Your Own Farm Experience में मेहमान भुंगा में रुकने के साथ चुनी हुई गतिविधियाँ जोड़ सकते हैं। वर्कशॉप और भोजन की अलग कीमत मेज़बान बताएगा। पूछताछ भेजना पक्की बुकिंग नहीं है।",
    ma: "Build Your Own Farm Experience में मेहमान भुंगा री रातां संग चुन्या काम-काज जोड़ सके है। वर्कशॉप अर भोजन रो अलग भाव मेजबान बतावैला। पूछताछ करणी पक्की बुकिंग कोनी।",
  },
  "Gau Seva sponsorship": {
    en: "The website's Gau Seva form lists Dholi Sheri, Tara and Roshni, with one-time, monthly or yearly choices and a contribution amount entered by the supporter. A form submission is an enquiry, not proof of payment or adoption.",
    hi: "वेबसाइट के गौ सेवा फ़ॉर्म में ढोली शेरी, तारा और रोशनी के नाम हैं। इसमें एक बार, मासिक या वार्षिक विकल्प और सहयोगी द्वारा भरी जाने वाली राशि है। फ़ॉर्म भेजना पूछताछ है, भुगतान या गोद लेने का प्रमाण नहीं।",
    ma: "वेबसाइट रै गौ सेवा फॉर्म में ढोली शेरी, तारा अर रोशनी रा नाम है। एक बार, महीनैवार या सालाना मदद रो विकल्प है अर रकम मदद करणार खुद भरै है। फॉर्म भेजणो पूछताछ है, भुगतान या गोद लेण रो सबूत कोनी।",
  },
  "Essentials Club": {
    en: "Essentials Club and future-product forms currently record interest only. They are not paid subscriptions, pre-orders, scheduled deliveries or automatic renewals.",
    hi: "Essentials Club और आने वाले उत्पादों के फ़ॉर्म अभी केवल रुचि दर्ज करते हैं। ये भुगतान वाली सदस्यता, प्री-ऑर्डर, तय डिलीवरी या अपने-आप नवीनीकरण नहीं हैं।",
    ma: "Essentials Club अर आवण वाला सामान रा फॉर्म अभी बस रुचि लिखै है। ई भुगतान वाली सदस्यता, पैली बुकिंग, तय भेजण या अपने-आप फेर चालू होण वाली सेवा कोनी।",
  },
  "Lab reports and certifications": {
    en: "A laboratory report is shown only when an approved report is attached to the relevant batch record. I cannot claim a certification or test report exists unless the current document is available. Ask the team about the product and batch.",
    hi: "लैब रिपोर्ट तभी दिखाई जाती है जब संबंधित बैच रिकॉर्ड के साथ स्वीकृत रिपोर्ट जुड़ी हो। मौजूदा दस्तावेज़ देखे बिना मैं किसी प्रमाणपत्र या जाँच रिपोर्ट का दावा नहीं कर सकता। उत्पाद और बैच के बारे में टीम से पूछें।",
    ma: "लैब रिपोर्ट तद ही देखावै जद संबंधित बैच रिकॉर्ड संग मंजूर रिपोर्ट जुड़ी होवै। चालू कागद देख्या बिना म्हूं प्रमाणपत्र या जांच रिपोर्ट होणो कोनी कह सकूं। सामान अर बैच खातर टीम सूं पूछो।",
  },
  "Sign in and order history": {
    en: "Sign in with Google using the same account used when placing the order. Then open My Lado Journey or Order History. Lado AI cannot show another customer's private order details.",
    hi: "ऑर्डर करते समय जिस Google खाते का इस्तेमाल किया था, उसी से साइन इन करें। फिर My Lado Journey या Order History खोलें। Lado AI किसी दूसरे ग्राहक के निजी ऑर्डर नहीं दिखा सकता।",
    ma: "जिण Google खाते सूं ऑर्डर कर्यो थो, उणै खाते सूं साइन-इन करो। फेर My Lado Journey या Order History खोलो। Lado AI दूसरै ग्राहक रा निजी ऑर्डर कोनी देखावै।",
  },
  "Returns and cancellations": {
    en: "The Policies & Legal page currently contains draft templates marked for legal review, not finalized legal guarantees. For a specific cancellation, return or refund, contact the Lado team with your order number.",
    hi: "Policies & Legal पेज पर अभी कानूनी समीक्षा के लिए ड्राफ़्ट दिए गए हैं, अंतिम कानूनी गारंटी नहीं। किसी खास रद्दीकरण, वापसी या रिफंड के लिए ऑर्डर नंबर के साथ Lado टीम से संपर्क करें।",
    ma: "Policies & Legal पन्ने पर अभी कानूनी जांच खातर मसौदा लिख्या है, आखरी कानूनी भरोसो कोनी। रद्द, वापसी या रकम लौटावण खातर ऑर्डर नंबर संग Lado टीम नै खबर करो।",
  },
  "Contact Lado Organics": {
    en: "Contact the Lado Organics team on WhatsApp at +91 96361 00337, or use the Contact & Support page. Never send passwords, OTPs or UPI PINs.",
    hi: "Lado Organics टीम से WhatsApp पर +91 96361 00337 पर संपर्क करें या Contact & Support पेज खोलें। पासवर्ड, OTP या UPI PIN कभी न भेजें।",
    ma: "Lado Organics टीम नै WhatsApp +91 96361 00337 पर खबर करो या Contact & Support पन्नो खोलो। पासवर्ड, OTP या UPI PIN कदी मत भेजो।",
  },
  "AI privacy and safe information": {
    en: "Do not share passwords, OTPs, UPI PINs or card details in Lado AI. Messages may be processed by an external AI service when generative assistance is enabled. See the Privacy page for the current disclosure.",
    hi: "Lado AI में पासवर्ड, OTP, UPI PIN या कार्ड की जानकारी साझा न करें। जनरेटिव AI चालू होने पर संदेश बाहरी AI सेवा द्वारा प्रोसेस हो सकते हैं। मौजूदा जानकारी के लिए Privacy पेज देखें।",
    ma: "Lado AI में पासवर्ड, OTP, UPI PIN या कार्ड री जानकारी मत देवो। जनरेटिव AI चालू होवै तो संदेश बाहरी AI सेवा तक जा सके है। पूरी बात खातर Privacy पन्नो देखो।",
  },
};

export function localizedKnowledgeAnswer(title: string, fallback: string, locale: LadoLocale): string {
  if (locale === "en") return fallback;
  const match = Object.entries(ANSWERS).find(([key]) => key.toLowerCase() === title.toLowerCase());
  return match?.[1][locale] ?? (locale === "hi"
    ? "इस विषय पर मेरे पास अभी पूरी तरह सत्यापित हिंदी जानकारी नहीं है। कृपया Lado टीम से पुष्टि करें: +91 96361 00337।"
    : "ई बात री पूरी पक्की मारवाड़ी जानकारी म्हारे पास अभी कोनी है। कृपा कर Lado टीम सूं पक्की कर ल्यो: +91 96361 00337।");
}

export function detectLadoLocale(message: string, preferred?: LadoLocale): LadoLocale {
  const value = message.toLocaleLowerCase();
  const marwariScript = /म्हां|म्हाने|म्हारो|म्हारी|म्हारा|थां|थारे|थारो|घणो|घणी|कोनी|कठै|कितरो|सूं|रो\b|री\b|रै\b|पधारो|खम्मा/.test(value);
  const marwariRoman = /\b(mhane|mharo|mhari|mhara|thare|tharo|thari|ghano|ghani|koni|kithai|kathai|kitro|suu|syo|padharo|khamma ghani)\b/.test(value);
  const hindiScript = /[\u0900-\u097f]/.test(value);
  if (marwariScript || marwariRoman) return "ma";
  if (hindiScript) return "hi";
  if (/\b(kya hai|kaise|kitna|kitne|mujhe|mera|meri|aapka|bataye|batao|chahiye|kahan|kab|kaise kare)\b/.test(value)) return "hi";
  return preferred || "en";
}

export function normalizeLadoText(value: string): string {
  return value.toLocaleLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0900-\u097f]+/g, " ")
    .trim();
}

export function productAliases(locale: LadoLocale): Record<string, string[]> {
  const common: Record<string, string[]> = {
    "a2-bilona-ghee": ["ghee", "bilona", "घी", "देसी घी", "घी रो", "घी री", "ghee ro", "ghino", "ghi"],
    "tharparkar-dhoop": ["dhoop", "धूप", "धूपबत्ती", "धूप रो", "dhoop ro", "loban"],
    "pure-kechua-khad": ["khad", "compost", "vermicompost", "kechua", "केंचुआ खाद", "खाद", "खाद रो", "खाद री", "khaad", "khad ro", "khad ri", "gobar khad"],
    "deep-work-bhunga-stay": ["bhunga", "stay", "भुंगा", "रहण", "ठहराव", "रुकणो", "bhunga ro", "rehno", "thahro"],
  };
  return common;
}

export function localizedCatalogReply(name: string, variants: Array<{ label: string; priceInr: number }>, locale: LadoLocale): string {
  const lines = variants.map((variant) => `${variant.label} — ₹${variant.priceInr.toLocaleString("en-IN")}`);
  if (locale === "hi") return variants.length
    ? `स्टोर में ${name} के लिए ये उपलब्ध पैक और दर्ज कीमतें दिख रही हैं:\n${lines.join("\n")}\nकीमत और स्टॉक बदल सकते हैं; ऑर्डर से पहले चेकआउट पर पुष्टि करें।`
    : `मुझे ${name} स्टोर में मिला, लेकिन अभी उपलब्ध पैक और कीमत दर्ज नहीं है। कृपया टीम से पूछें।`;
  if (locale === "ma") return variants.length
    ? `स्टोर में ${name} खातर ई पैक अर लिख्या भाव दिखै है:\n${lines.join("\n")}\nभाव अर स्टॉक बदल सके है; ऑर्डर सूं पैली चेकआउट पर पक्को कर ल्यो।`
    : `म्हाने ${name} स्टोर में मिल्यो, पण अभी पैक अर भाव लिख्या कोनी। टीम सूं पूछो।`;
  return variants.length
    ? `The current store listing for ${name} shows:\n${lines.join("\n")}\nPrices and stock can change; please confirm at checkout.`
    : `I found ${name}, but no available pack and price are currently listed. Please contact the Lado team.`;
}

export function localizedActionLabels(locale: LadoLocale) {
  if (locale === "hi") return {
    collection: "सभी उत्पाद देखें", ghee: "A2 बिलोना घी", dhoop: "थारपारकर धूप", compost: "केंचुआ खाद",
    stay: "भुंगा स्टे अनुरोध", experience: "फार्म अनुभव बनाएँ", gau: "गौ सेवा सहयोग",
    account: "मेरा Lado खाता", policies: "नीतियाँ और जानकारी", support: "सहायता से संपर्क करें",
    contact: "हमारी टीम से बात करें", farm: "खेत की कहानी देखें",
  };
  if (locale === "ma") return {
    collection: "सगळो सामान देखो", ghee: "A2 बिलोना घी", dhoop: "थारपारकर धूप", compost: "केंचुआ खाद",
    stay: "भुंगा ठहराव री अरज", experience: "खेत रो अनुभव बनावो", gau: "गौ सेवा में सहयोग",
    account: "म्हारो Lado खातो", policies: "नियम अर जानकारी", support: "मदद खातर संपर्क",
    contact: "म्हारी टीम सूं बात करो", farm: "खेत री कहानी देखो",
  };
  return {
    collection: "Explore the collection", ghee: "A2 Bilona Ghee", dhoop: "Tharparkar Dhoop", compost: "Vermicompost",
    stay: "Bhunga stay request", experience: "Build a farm experience", gau: "Gau Seva sponsorship form",
    account: "My Lado Journey", policies: "Policies & Legal", support: "Submit a support request",
    contact: "Contact our team", farm: "Discover our farm story",
  };
}
