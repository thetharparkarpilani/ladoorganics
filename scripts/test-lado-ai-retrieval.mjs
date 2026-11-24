import assert from "node:assert/strict";
import { findLocalAnswer } from "../src/lib/lado-ai-retrieval.ts";

const topics = [
  ["About Lado Organics", ["lado brand story","lado company information","lado organics introduction","tell me about lado organics","lado kya hai organics"]],
  ["Farm and Tharparkar cattle", ["tell me about tharparkar cows","which breed of cows","what cattle are on the farm","farm cow breed","tharparkar gai"]],
  ["A2 Bilona Ghee process", ["how do you prepare ghee","how is lado ghee prepared","how is ghee produced","ghee manufacturing process","traditional ghee making"]],
  ["Ghee storage", ["how should i keep ghee","how do i preserve ghee","ghee shelf storage","store ghee after opening","ghee storage instructions"]],
  ["Vermicompost information", ["tell me about compost","what is earthworm manure","what is organic manure","how vermicompost is made","kechua khad su hai"]],
  ["How to use vermicompost", ["how much manure should i use","compost dosage for plants","how to apply organic manure","fertilizer for pots","khad kitri nakhu"]],
  ["Dhoop usage", ["how to use incense","how to burn incense safely","how do i light dhoop","dhoop use instructions","dhoop kiyan jalau"]],
  ["Current product prices and stock", ["show current prices","how much are your products","which products are in stock","available pack sizes","kitro bhav hai"]],
  ["Cow dung and circular farm practices", ["how is cow dung reused","what happens to farm waste","biogas and compost process","cow dung management","gobar ro upyog"]],
  ["Product health and medical claims", ["is ghee a medicine","can ghee cure illness","does this product treat disease","health cure claims","ghee bimari thik kare"]],
  ["How to place an order", ["how can i purchase products","how to buy from website","place an order online","buy something from lado","saman kiyan mangwau"]],
  ["Shipping and delivery", ["when will my parcel arrive","delivery time to my pincode","shipping cost","do you ship to my city","saman kadi avse"]],
  ["Payment methods", ["how do i make payment","what payment options are available","can i pay by upi","cash on delivery","bhugtan kiyan karu"]],
  ["Manual UPI verification", ["i sent the upi payment","payment transferred but not updated","verify my transaction","upi payment pending","paisa mokli didha"]],
  ["Bhunga stay price and booking", ["how much does bhunga cost","book a farm stay","stay room availability","nightly stay rate","bhunga ro bhav"]],
  ["Farm experience", ["what can visitors do on farm","farm tour activities","visit the farm","custom farm experience","khet ro anubhav"]],
  ["Gau Seva sponsorship", ["how can i support cows","sponsor a calf","support gaushala","gau seva contribution","gai ri seva kiyan karu"]],
  ["Essentials Club", ["monthly essentials delivery","is this a subscription","recurring order plan","essentials membership","essentials club su hai"]],
  ["Lab reports and certifications", ["is the product certified","show quality test report","is there a lab certificate","organic certification proof","lab report hai ke"]],
  ["Sign in and order history", ["where can i see my purchases","track my order","my order status","view order history","mharo order kithai hai"]],
  ["Returns and cancellations", ["how do i get a refund","return a product","cancel my purchase","money back request","paisa wapas kiyan male"]],
  ["Contact Lado Organics", ["how can i contact the team","customer care phone number","talk to a real person","need human assistance","madad kithai mile"]],
  ["Gau Seva contribution amount", ["minimum donation amount","how much should i contribute","fixed sponsorship amount","sponsorship amount","how much to sponsor a calf"]],
  ["AI privacy and safe information", ["is my chat private","does lado ai save my information","can i share my otp","safe to tell upi pin","lado ai surakshit hai ke"]],
];

const entries = topics.map(([title]) => ({ category: "test", title, question_patterns: "", answer: title }));
let passed = 0;
const failures = [];
for (const [expected, questions] of topics) {
  for (const question of questions) {
    const actual = findLocalAnswer(question, entries)?.title ?? null;
    if (actual === expected) passed++;
    else failures.push({ question, expected, actual });
  }
}
const total = topics.reduce((sum, [, questions]) => sum + questions.length, 0);
console.log(`Lado AI retrieval benchmark: ${passed}/${total} (${(passed / total * 100).toFixed(1)}%)`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
assert.equal(failures.length, 0, "Every curated question should resolve to its expected topic");

// Safety check: vague or unrelated questions must not be forced into an arbitrary answer.
for (const question of ["hello", "xyz qwerty", "tell me something", "random unrelated sentence"]) {
  assert.equal(findLocalAnswer(question, entries), null, `Expected no confident match for: ${question}`);
}
console.log("Ambiguity and unknown-question checks passed.");
