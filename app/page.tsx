"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   WORKLINK KENYA — FINAL VERSION
   ✅ No years-of-experience field, no location in registration
   ✅ Factory Site Work added, Construction Site replaced
   ✅ Office Cleaning, Company Cleaning, Receptionist added
   ✅ All jobs available in ALL listed towns
   ✅ Town selection happens at Apply step (not registration)
   ✅ Accommodation note on relevant jobs
   ✅ No employer number shown — user fills WhatsApp, gets added to group
   ✅ Payment card pre-fills registration phone (editable)
   ✅ Vacancies shown on every card
   ✅ Real M-Pesa via starlink-backend-yb3n.onrender.com
   ✅ Fully responsive
═══════════════════════════════════════════════════════════════ */

const SMARTPAY_ENDPOINT  = "https://starlink-backend-yb3n.onrender.com";
const FEE         = 300;
const WHATSAPP_NUMBER = "254712000000"; // ← change to your real WA number

const BLUE   = "#1B6FE8";
const NAVY   = "#0D1B3E";
const GREEN  = "#10B981";
const RED    = "#EF4444";
const SLATE  = "#374151";
const LIGHT  = "#F8F9FC";
const BORDER = "#E5E7EB";
const SHADOW = "0 4px 24px rgba(27,111,232,.10)";
const SHADOW2= "0 8px 40px rgba(13,27,62,.14)";

/* ─── ALL TOWNS ACROSS KENYA ─── */
const ALL_TOWNS = [
  "Nairobi",
  "Kiambu",
  "Ruiru",
  "Thika",

  "Nakuru",
  "Naivasha",

  "Eldoret",

  "Kisumu",

  "Mombasa",
  "Nyali",

  "Malindi",
];
/* ─── JOB DATA — all jobs in all towns ─── */
const JOBS = [
  {
    id:1, icon:"🏭", cat:"Factory Work",
    title:"Factory Site Workers",
    desc:"Large manufacturing and packaging factories across Kenya urgently need general workers for production lines, packaging, sorting, and loading. No experience needed — full training given on your first day.",
    vacancies:120, type:"Full-time", salary:"KES 32,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:true, accommodationNote:"Hostel accommodation available near factory at subsidised cost.",
  },
  {
    id:2, icon:"🏗️", cat:"Construction",
    title:"Construction Site Labourers",
    desc:"Active building sites across all counties need strong, hardworking general labourers. Duties include mixing concrete, carrying materials, and basic site work. Transport from town centre provided daily.",
    vacancies:150, type:"Full-time", salary:"KES 30,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:3, icon:"🛡️", cat:"Security",
    title:"Security Guards (Day & Night Shifts)",
    desc:"Reputable security firm hiring guards for commercial buildings, malls, banks and gated communities across all listed towns. Full uniform and training provided. 18+ and physically fit required.",
    vacancies:80, type:"Full-time", salary:"KES 30,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:4, icon:"🧹", cat:"Office Cleaning",
    title:"Office Cleaners (CBD & Commercial)",
    desc:"Professional cleaning company needs reliable cleaners for corporate offices, banks, and government buildings. Morning shift starts 5am. Transport allowance and uniform included. Very flexible hours.",
    vacancies:60, type:"Full-time", salary:"KES 30,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:5, icon:"🏢", cat:"Company Cleaning",
    title:"Company & Industrial Cleaners",
    desc:"Manufacturing companies, warehouses and large facilities need dedicated cleaners for floors, equipment areas and common spaces. Both day and night shifts available. Overtime pay included.",
    vacancies:45, type:"Full-time", salary:"KES 31,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:6, icon:"💆", cat:"Cleaning",
    title:"Hospital & Clinic Cleaners",
    desc:"Private hospitals and clinics need health-conscious cleaners and ward porters. Protective equipment and uniform fully provided. Both male and female welcome. Must be respectful and punctual.",
    vacancies:30, type:"Full-time", salary:"KES 31,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:7, icon:"📋", cat:"Receptionist",
    title:"Receptionist / Front Desk Staff",
    desc:"Hotels, hospitals, companies, and schools across Kenya need presentable, friendly receptionists to welcome visitors, answer calls and manage front desk operations. KCSE and basic computer knowledge helpful but not required.",
    vacancies:35, type:"Full-time", salary:"KES 35,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:8, icon:"🎧", cat:"Receptionist",
    title:"Customer Service & Call Centre Agents",
    desc:"Growing companies need customer service representatives to handle enquiries by phone, WhatsApp and in person. Full training given. Fluent Swahili and basic English required. Smart phone provided.",
    vacancies:50, type:"Full-time", salary:"KES 33,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:9, icon:"🏠", cat:"House Help",
    title:"Domestic Workers / House Helps",
    desc:"Families in towns across Kenya need reliable domestic workers for cooking, cleaning, child care and general household tasks. Live-in accommodation with meals included. Friendly household, ideal for new workers.",
    vacancies:40, type:"Live-in", salary:"KES 30,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:true, accommodationNote:"Live-in position — free accommodation and meals provided by the employer.",
  },
  {
    id:10, icon:"🚗", cat:"Driving",
    title:"Delivery Riders & Van Drivers",
    desc:"E-commerce and courier companies need delivery riders (boda boda) and light van drivers for town deliveries. Valid licence required. Fuel or mileage allowance paid daily on top of salary.",
    vacancies:70, type:"Full-time", salary:"KES 35,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:11, icon:"🚌", cat:"Driving",
    title:"PSV Matatu Conductors",
    desc:"Matatu saccos operating in major towns need honest, reliable conductors. Commission on top of base salary. Must be 18+, sober and presentable. Uniform and insurance provided by employer.",
    vacancies:55, type:"Full-time", salary:"KES 35,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:12, icon:"🍽️", cat:"Hospitality",
    title:"Hotel Waiters & Waitresses",
    desc:"Hotels and restaurants across all major towns need waitstaff for dining halls, room service and events. Full training on the job. Smart appearance and good customer attitude required.",
    vacancies:40, type:"Full-time", salary:"KES 31,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:true, accommodationNote:"Accommodation may be offered depending on town of placement — confirmed at time of posting.",
  },
  {
    id:13, icon:"🌾", cat:"Farm Work",
    title:"General Farm Workers",
    desc:"Large farms and agricultural estates across Kenya need workers for planting, weeding, harvesting and general farm tasks. Housing and meals provided on site. Ideal for applicants from rural areas.",
    vacancies:150, type:"Full-time", salary:"KES 30,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:true, accommodationNote:"Free on-farm housing and daily meals included in the employment package.",
  },
  {
    id:14, icon:"💰", cat:"Cashier",
    title:"Supermarket & Shop Cashiers",
    desc:"Retail chains and supermarkets expanding across Kenya need honest cashiers and shop floor attendants. KCSE required. Full uniform and training provided. Friendly and customer-focused attitude essential.",
    vacancies:60, type:"Full-time", salary:"KES 30,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:15, icon:"🛍️", cat:"Shop Attendant",
    title:"Shop Attendants & Merchandisers",
    desc:"Retail businesses across all towns need floor staff for stocking shelves, attending to customers and general shop duties. No experience needed. Training given on day one.",
    vacancies:80, type:"Full-time", salary:"KES 30,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:16, icon:"🧱", cat:"Masonry",
    title:"Mason Helpers & Block Layers",
    desc:"Construction projects across all counties need helpers for brick laying, plastering and general masonry. You will work alongside qualified masons and learn on the job. Hard workers welcome.",
    vacancies:35, type:"Contract", salary:"KES 32,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:17, icon:"⚡", cat:"Electrical",
    title:"Electrical Site Helpers",
    desc:"Construction firms need helpers to assist licensed electricians on active sites. No training required — you will learn as you work. Must follow site safety rules. Protective gear provided.",
    vacancies:20, type:"Contract", salary:"KES 40,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
  {
    id:18, icon:"🔧", cat:"Plumbing",
    title:"Plumbing Helpers",
    desc:"Property management and construction companies need plumbing helpers across all regions. Work alongside qualified plumbers, learn on the job and earn a steady income from week one.",
    vacancies:18, type:"Full-time", salary:"KES 33,000/mo", start:"10 Jul 2026", deadline:"2026-07-09",
    accommodation:false,
  },
];

const ALL_CATS = ["All", ...new Set(JOBS.map(j => j.cat))];

const WHY = [
  { icon:"🆓", title:"No Experience Required",  body:"We welcome all Kenyans 18+. Employers provide full on-the-job training. Just show up ready to work." },
  { icon:"📱", title:"Apply from Any Phone",    body:"Register and apply in under 5 minutes from your mobile phone. No computer or email needed." },
  { icon:"💬", title:"Added to WhatsApp Group", body:"After your application fee you are added to the official WorkLink WhatsApp group and connected with your employer." },
  { icon:"📍", title:"Work in Your Town",       body:"All jobs are available across Kenya. You choose the town that suits you when you apply." },
  { icon:"💵", title:"KES 30,000+ Per Month",   body:"Every job listed on WorkLink Kenya pays a minimum of KES 30,000 per month. Fair wages always." },
  { icon:"🏠", title:"Accommodation Offered",   body:"Many jobs include free or subsidised accommodation. Clearly marked on each listing." },
];

/* ─── phone helpers ─── */
function normalisePhone(raw) {
  const p = raw.replace(/\D/g,"");
  if (p.startsWith("07")||p.startsWith("01")) return "254"+p.slice(1);
  if (p.startsWith("254"))                    return p;
  return null;
}
function isValidPhone(raw) {
  const p = raw.replace(/\D/g,"");
  return p.match(/^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8})$/);
}

const daysLeft = (d: string) => {
  const diff = new Date(d).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);

  return days > 0
    ? `${days} day${days !== 1 ? "s" : ""} left`
    : "Closing today";
};

function useCountUp(target,duration=1600,start=false){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!start)return;
    let s=0; const step=target/(duration/16);
    const iv=setInterval(()=>{ s=Math.min(s+step,target); setVal(Math.floor(s)); if(s>=target)clearInterval(iv); },16);
    return ()=>clearInterval(iv);
  },[start,target,duration]);
  return val;
}

/* ════════════════════════════════════════════════════════
   CSS
════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:#fff;color:${SLATE};overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}
button,input,select,textarea{font-family:inherit}
input::placeholder,textarea::placeholder{color:#9CA3AF}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;height:60px;background:rgba(255,255,255,.93);backdrop-filter:blur(16px);border-bottom:1px solid ${BORDER};display:flex;align-items:center;justify-content:space-between;padding:0 clamp(14px,4vw,48px);transition:box-shadow .2s}
.nav.scrolled{box-shadow:0 2px 20px rgba(0,0,0,.07)}
.nav-logo{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.05rem;color:${NAVY};display:flex;align-items:center;gap:7px;cursor:pointer;flex-shrink:0;white-space:nowrap}
.logo-dot{width:8px;height:8px;background:${BLUE};border-radius:50%;flex-shrink:0}
.nav-r{display:flex;gap:8px;align-items:center}
.btn-ghost{padding:7px 16px;border:1.5px solid ${BORDER};border-radius:9px;background:transparent;color:${SLATE};font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
.btn-ghost:hover{border-color:${BLUE};color:${BLUE}}
.btn-blue{padding:8px 20px;border:none;border-radius:9px;background:${BLUE};color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all .18s;white-space:nowrap}
.btn-blue:hover{background:#1558c0;transform:translateY(-1px)}
.btn-blue:disabled{opacity:.45;cursor:not-allowed;transform:none}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;padding:80px clamp(16px,5vw,80px) 56px;background:linear-gradient(155deg,#EEF4FF 0%,#F8F9FC 55%,#E8F5E9 100%);position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-80px;right:-40px;width:380px;height:380px;background:radial-gradient(circle,rgba(27,111,232,.09),transparent 70%);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:-50px;left:-30px;width:280px;height:280px;background:radial-gradient(circle,rgba(16,185,129,.08),transparent 70%);pointer-events:none}
.hero-inner{max-width:680px;position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:#fff;border:1px solid ${BORDER};border-radius:99px;padding:5px 14px 5px 7px;font-size:11px;font-weight:700;color:${NAVY};margin-bottom:18px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.hero-badge-i{width:22px;height:22px;background:linear-gradient(135deg,${BLUE},${GREEN});border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px}
.noexp-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#D1FAE5,#A7F3D0);border:1px solid #6EE7B7;border-radius:9px;padding:6px 14px;font-size:13px;font-weight:700;color:#065F46;margin-bottom:14px}
.hero h1{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:clamp(1.9rem,4.8vw,3.2rem);color:${NAVY};line-height:1.12;letter-spacing:-.025em;margin-bottom:12px}
.hero h1 .ac{color:${BLUE}}
.hero-sub{font-size:clamp(.88rem,1.7vw,1rem);color:#6B7280;line-height:1.82;margin-bottom:8px}
.hero-note{font-size:13px;color:${GREEN};font-weight:700;margin-bottom:28px;display:flex;align-items:center;gap:6px}
.hero-btns{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:44px}
.btn-hp{padding:13px 34px;border-radius:12px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:.95rem;font-weight:800;background:linear-gradient(135deg,${BLUE},#1558c0);color:#fff;box-shadow:0 8px 24px rgba(27,111,232,.34);cursor:pointer;transition:all .2s}
.btn-hp:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(27,111,232,.42)}
.btn-hs{padding:13px 30px;border-radius:12px;border:1.5px solid ${BORDER};background:#fff;color:${NAVY};font-size:.95rem;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s}
.btn-hs:hover{border-color:${BLUE};color:${BLUE}}
.stats-row{display:flex;gap:10px;flex-wrap:wrap}
.stat-pill{background:#fff;border:1px solid ${BORDER};border-radius:14px;padding:12px 20px;text-align:center;box-shadow:${SHADOW}}
.stat-n{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.4rem;font-weight:800;color:${NAVY};line-height:1}
.stat-l{font-size:10px;color:#9CA3AF;font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:.05em}

/* SECTION */
.sec{padding:60px clamp(14px,5vw,72px)}
.sec-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${BLUE};margin-bottom:7px}
.sec-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:clamp(1.35rem,2.7vw,1.9rem);color:${NAVY};line-height:1.18;margin-bottom:6px}
.sec-sub{color:#6B7280;font-size:13px;line-height:1.72;max-width:520px}
.sec-head{margin-bottom:36px}

/* WHY GRID */
.why-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.why-card{background:#fff;border:1.5px solid ${BORDER};border-radius:16px;padding:22px 18px;transition:all .2s}
.why-card:hover{border-color:${BLUE};box-shadow:${SHADOW};transform:translateY(-2px)}
.why-ic{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#EEF4FF,#DBEAFE);display:flex;align-items:center;justify-content:center;font-size:19px;margin-bottom:11px}
.why-t{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;color:${NAVY};margin-bottom:5px}
.why-b{font-size:12px;color:#6B7280;line-height:1.62}

/* CTA BANNER */
.cta-banner{background:linear-gradient(135deg,${NAVY},#1a3a8f);padding:52px clamp(14px,5vw,72px);text-align:center;color:#fff}
.cta-banner h2{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:clamp(1.4rem,2.8vw,2rem);margin-bottom:10px}
.cta-banner p{color:rgba(255,255,255,.7);font-size:13px;max-width:480px;margin:0 auto 24px;line-height:1.7}

/* FOOTER */
footer{background:${NAVY};padding:36px clamp(14px,5vw,72px);text-align:center}
.fl{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:.95rem;color:#fff;margin-bottom:7px}
footer p{font-size:11px;color:rgba(255,255,255,.4);line-height:1.6}
.foot-links{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:10px}
.foot-links a{font-size:11px;color:rgba(255,255,255,.4)}

/* DASH NAV */
.dash-nav{position:sticky;top:60px;z-index:40;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);border-bottom:1px solid ${BORDER};padding:0 clamp(10px,3.5vw,40px);height:48px;display:flex;align-items:center;gap:4px;overflow-x:auto}
.dash-nav::-webkit-scrollbar{height:0}
.dnav-btn{padding:5px 13px;border-radius:7px;border:none;background:transparent;color:#9CA3AF;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0}
.dnav-btn.active{background:${LIGHT};color:${NAVY}}

/* DASH LAYOUT */
.dw{max-width:1200px;margin:0 auto;padding:20px clamp(10px,3.5vw,40px)}

/* WELCOME */
.welcome{background:linear-gradient(135deg,${NAVY},#1a3a8f);border-radius:18px;padding:22px 26px;color:#fff;margin-bottom:20px;position:relative;overflow:hidden}
.welcome::before{content:'';position:absolute;right:-24px;top:-24px;width:140px;height:140px;background:radial-gradient(circle,rgba(255,255,255,.07),transparent 70%);pointer-events:none}
.whi{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:clamp(1rem,2.5vw,1.3rem);margin-bottom:4px}
.wsub{font-size:12px;opacity:.72;line-height:1.5}

/* DASH STATS */
.ds-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
@media(max-width:600px){.ds-grid{grid-template-columns:repeat(2,1fr)}}
.dsc{background:#fff;border:1.5px solid ${BORDER};border-radius:14px;padding:14px}
.dsc-ico{font-size:20px;margin-bottom:7px}
.dsc-n{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;color:${NAVY};line-height:1}
.dsc-l{font-size:10px;color:#9CA3AF;margin-top:3px}

/* SEARCH + FILTER */
.s-row{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.sbox{flex:1;min-width:180px;display:flex;align-items:center;gap:7px;background:#fff;border:1.5px solid ${BORDER};border-radius:11px;padding:9px 13px}
.sbox input{flex:1;border:none;outline:none;font-size:13px;color:${NAVY};min-width:0}
.sico{font-size:15px;color:#9CA3AF;flex-shrink:0}
.ftabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
.ftab{padding:5px 13px;border-radius:99px;border:1.5px solid ${BORDER};background:#fff;color:#9CA3AF;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap}
.ftab.on{background:${BLUE};border-color:${BLUE};color:#fff}

/* JOB GRID */
.jgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:900px){.jgrid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.jgrid{grid-template-columns:repeat(2,1fr);gap:9px}}
.jcard{background:#fff;border:1.5px solid ${BORDER};border-radius:16px;padding:14px;display:flex;flex-direction:column;transition:all .2s;position:relative;overflow:hidden}
.jcard:hover{transform:translateY(-3px);box-shadow:${SHADOW2};border-color:${BLUE}}
.jcard-fav{position:absolute;top:10px;right:10px;background:none;border:none;cursor:pointer;font-size:16px;opacity:.5;transition:opacity .15s;padding:2px}
.jcard-fav.on,.jcard-fav:hover{opacity:1}
.applied-ribbon{background:${GREEN};color:#fff;font-size:9px;font-weight:700;border-radius:0 0 0 7px;padding:3px 7px;position:absolute;top:0;right:0;text-transform:uppercase;letter-spacing:.05em;border-top-right-radius:14px}
.jc-ico{width:38px;height:38px;background:linear-gradient(135deg,#EEF4FF,#DBEAFE);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:19px;margin-bottom:8px;flex-shrink:0}
.jc-cat{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${BLUE};margin-bottom:2px}
.jc-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:12px;color:${NAVY};line-height:1.3;margin-bottom:5px;padding-right:20px}
.jc-desc{font-size:11px;color:#6B7280;line-height:1.58;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.jc-meta{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
.jcm{font-size:10px;color:#9CA3AF;display:flex;gap:4px;align-items:center;flex-wrap:wrap}
.jcm strong{color:${SLATE};font-weight:600}
.jc-accom{background:#D1FAE5;border:1px solid #6EE7B7;border-radius:7px;padding:4px 9px;font-size:10px;font-weight:700;color:#065F46;margin-bottom:8px;display:flex;align-items:center;gap:4px}
.jc-tags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}
.tag{border-radius:99px;padding:2px 7px;font-size:9px;font-weight:700;border:1px solid}
.tag-blue{background:#DBEAFE;border-color:#BFDBFE;color:#1E40AF}
.tag-green{background:#D1FAE5;border-color:#A7F3D0;color:#065F46}
.tag-purple{background:#EDE9FE;border-color:#DDD6FE;color:#5B21B6}
.tag-orange{background:#FEF3C7;border-color:#FDE68A;color:#92400E}
.jc-salary{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:800;color:${GREEN};margin-bottom:7px}
.jc-vacancies{font-size:10px;font-weight:700;color:${RED};margin-bottom:7px;display:flex;align-items:center;gap:4px}
.btn-apply{width:100%;padding:9px;border-radius:9px;border:none;background:linear-gradient(135deg,${BLUE},#1558c0);color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s}
.btn-apply:hover{transform:translateY(-1px)}
.btn-apply:disabled{background:#D1D5DB;cursor:not-allowed;transform:none}
.btn-apply.applied{background:${GREEN}}
.btn-apply.applied:hover{transform:none}

/* PROFILE */
.pgrid{display:grid;grid-template-columns:250px 1fr;gap:18px}
@media(max-width:660px){.pgrid{grid-template-columns:1fr}}
.pside{background:#fff;border:1.5px solid ${BORDER};border-radius:16px;overflow:hidden}
.pside-cov{height:64px;background:linear-gradient(135deg,${BLUE},#1558c0)}
.pside-body{padding:0 16px 20px;margin-top:-30px}
.pside-av{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,${BLUE},${GREEN});border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;margin-bottom:7px}
.pside-name{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:.9rem;color:${NAVY};margin-bottom:2px}
.pside-sub{font-size:11px;color:#9CA3AF}
.pmenu{margin-top:12px;display:flex;flex-direction:column;gap:2px}
.pmi{padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#6B7280;display:flex;align-items:center;gap:7px;transition:all .15s}
.pmi:hover{background:${LIGHT};color:${NAVY}}
.pmi.active{background:#EEF4FF;color:${BLUE}}
.pmi.red{color:${RED}}.pmi.red:hover{background:#FEE2E2;color:${RED}}
.pinfo{background:#fff;border:1.5px solid ${BORDER};border-radius:16px;padding:20px}
.pinfo-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.9rem;color:${NAVY};margin-bottom:16px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:480px){.info-grid{grid-template-columns:1fr}}
.inf-f .il{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9CA3AF;margin-bottom:3px}
.inf-f .iv{font-size:13px;font-weight:600;color:${NAVY}}

/* MODAL */
.modal-bg{position:fixed;inset:0;z-index:200;background:rgba(13,27,62,.65);backdrop-filter:blur(5px);display:flex;align-items:flex-end;justify-content:center;padding:0}
@media(min-width:580px){.modal-bg{align-items:center;padding:20px}}
.modal-box{background:#fff;width:100%;max-width:490px;max-height:92vh;overflow-y:auto;border-radius:22px 22px 0 0;box-shadow:0 40px 80px rgba(13,27,62,.3);animation:mIn .28s cubic-bezier(.34,1.56,.64,1)}
@media(min-width:580px){.modal-box{border-radius:20px}}
@keyframes mIn{from{transform:scale(.93) translateY(14px);opacity:0}to{transform:none;opacity:1}}
.mh{padding:18px 20px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.mt{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1rem;color:${NAVY}}
.ms{font-size:11px;color:#9CA3AF;margin-top:2px}
.mclose{background:${LIGHT};border:none;cursor:pointer;width:30px;height:30px;border-radius:7px;color:${SLATE};font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}
.mclose:hover{background:${BORDER}}
.mb{padding:18px 20px}
.mf{padding:0 20px 20px;display:flex;gap:8px}

/* FORM */
.fg{margin-bottom:13px}
.fg .fl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9CA3AF;margin-bottom:5px;display:block}
.finp{width:100%;border:1.5px solid ${BORDER};border-radius:9px;padding:10px 12px;font-size:13px;color:${NAVY};outline:none;background:#fff;transition:border-color .18s,box-shadow .18s}
.finp:focus{border-color:${BLUE};box-shadow:0 0 0 3px rgba(27,111,232,.1)}
.finp.err{border-color:${RED}}
.fsel{width:100%;border:1.5px solid ${BORDER};border-radius:9px;padding:10px 12px;font-size:13px;color:${NAVY};outline:none;background:#fff;cursor:pointer;transition:border-color .18s}
.fsel:focus{border-color:${BLUE}}
.fsel.err{border-color:${RED}}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ferr{font-size:11px;color:${RED};margin-top:3px}
.fhint{font-size:10px;color:#9CA3AF;margin-top:3px;line-height:1.5}
.btn-full{width:100%;padding:11px;border-radius:10px;border:none;background:linear-gradient(135deg,${BLUE},#1558c0);color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-full:hover:not(:disabled){transform:translateY(-1px)}
.btn-full:disabled{opacity:.44;cursor:not-allowed;transform:none}
.btn-out{width:100%;padding:11px;border-radius:10px;border:1.5px solid ${BORDER};background:#fff;color:${SLATE};font-size:13px;font-weight:600;cursor:pointer;transition:all .18s}
.btn-out:hover{border-color:${BLUE};color:${BLUE}}

/* STEP PROGRESS */
.spg{margin-bottom:20px}
.spg-wrap{height:4px;background:#EEF4FF;border-radius:99px;overflow:hidden;margin-bottom:5px}
.spg-fill{height:100%;background:linear-gradient(90deg,${BLUE},${GREEN});border-radius:99px;transition:width .35s ease}
.spg-labs{display:flex;justify-content:space-between}
.spg-labs span{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}

/* TERMS */
.terms-scroll{background:${LIGHT};border:1.5px solid ${BORDER};border-radius:10px;padding:13px;max-height:150px;overflow-y:auto;font-size:11px;color:#6B7280;line-height:1.68;margin-bottom:13px}
.terms-scroll h4{font-size:12px;color:${NAVY};font-weight:700;margin-bottom:4px}
.check-row{display:flex;align-items:flex-start;gap:8px;cursor:pointer}
.check-row input[type=checkbox]{margin-top:2px;accent-color:${BLUE};width:14px;height:14px;flex-shrink:0;cursor:pointer}
.check-row label{font-size:12px;color:${SLATE};cursor:pointer;line-height:1.5}
.check-row a{color:${BLUE}}

/* APPLY MODAL SPECIFICS */
.info-box{border-radius:10px;padding:10px 13px;font-size:12px;font-weight:600;margin-bottom:14px;display:flex;gap:8px;align-items:flex-start}
.info-box.blue{background:#EEF4FF;border:1px solid #BFDBFE;color:#1E40AF}
.info-box.green{background:#D1FAE5;border:1px solid #6EE7B7;color:#065F46}
.info-box.yellow{background:#FFFBEB;border:1px solid #FCD34D;color:#92400E}
.confirm-list{display:flex;flex-direction:column}
.crow{display:flex;justify-content:space-between;align-items:flex-start;padding:8px 0;border-bottom:1px solid ${BORDER};gap:10px}
.crow:last-child{border-bottom:none}
.ck{font-size:11px;color:#9CA3AF;font-weight:600;flex-shrink:0}
.cv{font-size:12px;color:${NAVY};font-weight:600;text-align:right}

/* WA BOX */
.wa-box{background:linear-gradient(135deg,#D1FAE5,#A7F3D0);border:1.5px solid #6EE7B7;border-radius:12px;padding:14px;margin-bottom:14px;text-align:center}
.wa-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:14px;color:#064E3B;margin-bottom:5px}
.wa-sub{font-size:12px;color:#065F46;line-height:1.62}
.wa-num{font-size:16px;font-weight:800;color:#064E3B;margin-top:4px;letter-spacing:.04em}

/* PAYMENT */
.mpesa-logo{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:${GREEN};font-size:13px;letter-spacing:1px}
.pay-amount{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.4rem;color:${NAVY}}
.stk-wrap{text-align:center;padding:10px 0}
.stk-spin{width:38px;height:38px;border:3px solid rgba(27,111,232,.15);border-top-color:${BLUE};border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 12px}
@keyframes spin{to{transform:rotate(360deg)}}
.stk-t{font-size:14px;font-weight:700;color:${NAVY};margin-bottom:5px}
.stk-s{font-size:12px;color:#9CA3AF;line-height:1.65}
.done-wrap{text-align:center;padding:10px 0}
.done-ico{font-size:44px;margin-bottom:10px}
.done-t{font-size:17px;font-weight:800;color:${GREEN};font-family:'Plus Jakarta Sans',sans-serif;margin-bottom:5px}
.done-s{font-size:12px;color:#6B7280;line-height:1.65;max-width:320px;margin:0 auto}

/* EMPTY */
.empty{text-align:center;padding:48px 20px;color:#9CA3AF}
.empty-ico{font-size:40px;margin-bottom:10px}
.empty h4{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;color:${NAVY};margin-bottom:5px}
.empty p{font-size:12px;line-height:1.6}

/* TOAST */
.toast-wrap{position:fixed;bottom:18px;right:18px;z-index:300;display:flex;flex-direction:column;gap:7px;pointer-events:none}
.toast{background:#111827;color:#fff;border-radius:12px;padding:10px 15px;font-size:12px;font-weight:600;display:flex;align-items:center;gap:7px;min-width:200px;max-width:300px;box-shadow:0 8px 26px rgba(0,0,0,.22);animation:tIn .28s ease;pointer-events:all}
.toast.leaving{animation:tOut .28s ease forwards}
@keyframes tIn{from{transform:translateX(110%);opacity:0}to{transform:none;opacity:1}}
@keyframes tOut{to{transform:translateX(110%);opacity:0}}

/* NO EXP BANNER */
.noexp-banner{background:linear-gradient(135deg,#D1FAE5,#A7F3D0);border:1.5px solid #6EE7B7;border-radius:18px;padding:24px 28px;display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;margin-bottom:24px}
.noexp-banner h3{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:clamp(1.1rem,2.5vw,1.4rem);color:#064E3B;margin-bottom:6px}
.noexp-banner p{font-size:13px;color:#065F46;line-height:1.7}
`;

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
let _tid = 0;
function Toasts({ list, remove }) {
  return <div className="toast-wrap">{list.map(t=><ToastItem key={t.id} t={t} remove={remove}/>)}</div>;
}
function ToastItem({ t, remove }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(()=>{
    const tm=setTimeout(()=>{ setLeaving(true); setTimeout(()=>remove(t.id),290); },3800);
    return ()=>clearTimeout(tm);
  },[]);
  return <div className={`toast${leaving?" leaving":""}`}><span>{t.icon||"ℹ️"}</span><span>{t.msg}</span></div>;
}

/* ════════════════════════════════════════
   REGISTER WIZARD — 3 steps (no location, no experience)
════════════════════════════════════════ */
const REG_STEPS = ["Account","Profile","Terms"];

function RegisterModal({ onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name:"", phone:"", password:"", confirm:"", gender:"", age:"18", education:"", agreed:true });
const [errs, setErrs] = useState<Record<string, string>>({}); 
 const set = (k,v) => setF(p=>({...p,[k]:v}));

  const validators = [
    ()=>{
      const e: Record<string, string> = {};
      if(!f.name.trim()) e.name="Enter your full name";
      const p=f.phone.replace(/\D/g,"");
      if(!p.match(/^(07\d{8}|01\d{8}|254[71]\d{8})$/)) e.phone="Enter valid number: 07xx/01xx/254xx";
      if(f.password.length<6) e.password="Minimum 6 characters";
      if(f.password!==f.confirm) e.confirm="Passwords do not match";
      return e;
    },
    ()=>{
      const e: Record<string, string> = {};
      if(!f.gender) e.gender="Select your gender";
      if(!f.age||+f.age<18||+f.age>70) e.age="Must be 18–70 years old";
      if(!f.education) e.education="Select your education level";
      return e;
    },
    ()=>{
      const e: Record<string, string> = {};
      if(!f.agreed) e.agreed="You must accept the terms to continue";
      return e;
    },
  ];

  const next = async () => {
    const e = validators[step]();
    if(Object.keys(e).length){ setErrs(e); return; }
    setErrs({});
    if(step<2){ setStep(s=>s+1); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoading(false);
    onDone(f);
  };

  const inp = (k) => ({
    className:`finp${errs[k]?" err":""}`,
    value:f[k],
    onChange:(e)=>{ set(k,e.target.value); if(errs[k]) setErrs(p=>({...p,[k]:""})); },
  });
  const sel = (k) => ({
    className:`fsel${errs[k]?" err":""}`,
    value:f[k],
    onChange:(e)=>{ set(k,e.target.value); if(errs[k]) setErrs(p=>({...p,[k]:""})); },
  });

  const pct = ((step+1)/3)*100;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="mh">
          <div>
            <div className="mt">Create your WorkLink profile</div>
            <div className="ms">{REG_STEPS[step]} — Step {step+1} of 3</div>
          </div>
          <button className="mclose" onClick={onClose}>×</button>
        </div>
        <div className="mb">
          <div className="spg">
            <div className="spg-wrap"><div className="spg-fill" style={{width:`${pct}%`}}/></div>
            <div className="spg-labs">
              {REG_STEPS.map((l,i)=><span key={l} style={{color:i<=step?BLUE:"#D1D5DB"}}>{l}</span>)}
            </div>
          </div>

          {step===0 && <>
            <div className="fg">
              <label className="fl">Full Name</label>
              <input {...inp("name")} type="text" placeholder="e.g. Jane Wanjiku" autoComplete="name"/>
              {errs.name && <div className="ferr">{errs.name}</div>}
            </div>
            <div className="fg">
              <label className="fl">Phone Number</label>
              <input
                className={`finp${errs.phone?" err":""}`}
                type="tel" inputMode="numeric"
                placeholder="07XX XXX XXX  or  01XX  or  254XXXXXXXXX"
                value={f.phone}
                onChange={e=>{ set("phone",e.target.value.replace(/[^\d]/g,"").slice(0,12)); if(errs.phone) setErrs(p=>({...p,phone:""})); }}
              />
              {errs.phone && <div className="ferr">{errs.phone}</div>}
              <div className="fhint">Accepts 07xx, 01xx (Safaricom/Airtel) or 254xxxxxxxxx</div>
            </div>
            <div className="fg">
              <label className="fl">Password</label>
              <input {...inp("password")} type="password" placeholder="Minimum 6 characters" autoComplete="new-password"/>
              {errs.password && <div className="ferr">{errs.password}</div>}
            </div>
            <div className="fg">
              <label className="fl">Confirm Password</label>
              <input {...inp("confirm")} type="password" placeholder="Repeat your password" autoComplete="new-password"/>
              {errs.confirm && <div className="ferr">{errs.confirm}</div>}
            </div>
          </>}

          {step===1 && <>
            <div className="info-box green" style={{marginBottom:14}}>
              <span>✅</span>
              <span>No experience required — all Kenyans 18+ are welcome to apply!</span>
            </div>
            <div className="frow">
              <div className="fg">
                <label className="fl">Gender</label>
                <select {...sel("gender")}>
                  <option value="">Select…</option>
                  <option>Male</option><option>Female</option><option>Prefer not to say</option>
                </select>
                {errs.gender && <div className="ferr">{errs.gender}</div>}
              </div>
              <div className="fg">
                <label className="fl">Age</label>
                <input className={`finp${errs.age?" err":""}`} type="number" min={18} max={70} placeholder="e.g. 25" value={f.age} onChange={e=>{ set("age",e.target.value); if(errs.age) setErrs(p=>({...p,age:""})); }}/>
                {errs.age && <div className="ferr">{errs.age}</div>}
              </div>
            </div>
            <div className="fg">
              <label className="fl">Highest Education Level</label>
              <select {...sel("education")}>
                <option value="">Select…</option>
                <option>No formal education</option>
                <option>Primary (KCPE)</option>
                <option>Secondary (KCSE)</option>
                <option>Certificate / Diploma</option>
                <option>Degree or Higher</option>
              </select>
              {errs.education && <div className="ferr">{errs.education}</div>}
            </div>
          </>}

          {step===2 && <>
            <div className="terms-scroll">
              <h4>WorkLink Kenya — Terms & Conditions</h4>
              <p><strong>1. Eligibility.</strong> You must be 18 years or older. All information must be accurate.</p><br/>
              <p><strong>2. Application Fee.</strong> A one-time CONNECT Fee of <strong>KES {FEE}</strong> is charged per job application via M-Pesa. This connects you with the employer and adds you to the official WorkLink WhatsApp group.</p><br/>
              <p><strong>3. No Experience Required.</strong> Employers listed on WorkLink provide on-the-job training. You do not need prior experience.</p><br/>
              <p><strong>4. Accommodation.</strong> Some jobs include free or subsidised accommodation as stated on the listing. This is confirmed by the employer on contact.</p><br/>
              <p><strong>5. Start Date.</strong> All current vacancies start 10 July 2026. You must be available to report to work on that date.</p><br/>
              <p><strong>6. WhatsApp Group.</strong> After payment confirmation you will be added to the WorkLink WhatsApp group where employers contact workers directly.</p><br/>
              <p><strong>7. Privacy.</strong> Your data is handled under the Kenya Data Protection Act 2019. We never sell your data.</p>
            </div>
            <div className="check-row" style={{marginBottom:6}}>
              <input type="checkbox" id="agreed" checked={f.agreed} onChange={e=>{ set("agreed",e.target.checked); if(errs.agreed) setErrs(p=>({...p,agreed:""})); }}/>
              <label htmlFor="agreed">I have read and agree to the <a href="#" onClick={e=>e.preventDefault()}>Terms & Conditions</a> and <a href="#" onClick={e=>e.preventDefault()}>Privacy Policy</a>. I am 18+ and available to start 10 July 2026.</label>
            </div>
            {errs.agreed && <div className="ferr" style={{marginTop:4}}>{errs.agreed}</div>}
          </>}
        </div>
        <div className="mf">
          {step>0 && <button className="btn-out" onClick={()=>{ setStep(s=>s-1); setErrs({}); }} style={{flex:1}}>← Back</button>}
          <button className="btn-full" onClick={next} disabled={loading} style={{flex:2}}>
            {loading
              ? <><span className="stk-spin" style={{width:15,height:15,borderWidth:2}}/> Creating account…</>
              : step===2 ? "Create Account →" : "Continue →"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   APPLY MODAL — Step 0: form (town + WA)
                 Step 1: summary
                 Step 2: M-Pesa payment
                 Step 3: success
════════════════════════════════════════ */
function ApplyModal({ job, userPhone, onClose, onApplied, addToast }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ town:"", waPhone: userPhone || "", notes:"" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  // Payment state
  const [payPhone, setPayPhone] = useState(userPhone || "");
  const [payStep, setPayStep] = useState("idle"); // idle|loading|stk|timeout|done
  const [dots, setDots] = useState(".");
  const [payErr, setPayErr] = useState("");
  const pollRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(()=>{
    if(payStep!=="stk"&&payStep!=="loading") return;
    const t=setInterval(()=>setDots(d=>d.length>=3?".":d+"."),600);
    return ()=>clearInterval(t);
  },[payStep]);

  useEffect(()=>()=>{ clearInterval(pollRef.current); clearTimeout(timeoutRef.current); },[]);

  const setField=(k,v)=>setF(p=>({...p,[k]:v}));

  const validateForm=()=>{
  const e: Record<string, string> = {};
    if(!f.town) e.town="Select the town you want to work in";
    if(!isValidPhone(f.waPhone)) e.waPhone="Enter valid WhatsApp number (07xx / 01xx / 254xx)";
    return e;
  };

  const goConfirm=()=>{
    const e=validateForm();
    if(Object.keys(e).length){ setErrs(e); return; }
    setErrs({}); setStep(1);
  };

  const startPay=async()=>{
    if(!isValidPhone(payPhone)){ setPayErr("Enter a valid M-Pesa number: 07xx, 01xx, or 254xxxxxxxxx"); return; }
    const norm=normalisePhone(payPhone);
    setPayErr(""); setPayStep("loading");
    try {
      const res=await fetch(`${SMARTPAY_ENDPOINT}/api/runPrompt`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          phone:norm,
          amount:FEE,
          local_id:`WL-${job.id}-${Date.now()}`,
          transaction_desc:`WorkLink Kenya Application Fee KES ${FEE}`,
        }),
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok||data.status===false){ setPayErr(data.msg||"STK push failed. Please try again."); setPayStep("idle"); return; }

      const cid=data.checkout_request_id||data.checkoutRequestId||null;
      setPayStep("stk");

      if(cid){
        timeoutRef.current=setTimeout(()=>{ clearInterval(pollRef.current); setPayStep("timeout"); },55000);
        pollRef.current=setInterval(async()=>{
          try{
            const r=await fetch(`${SMARTPAY_ENDPOINT}/api/status/${cid}`);
            if(!r.ok) return;
            const d=await r.json();
            if(d.status==="completed"||d.success===true||d.ResultCode===0){
              clearInterval(pollRef.current); clearTimeout(timeoutRef.current); setPayStep("done");
            } else if(d.status==="failed"||(d.ResultCode!==undefined&&d.ResultCode!==0)){
              clearInterval(pollRef.current); clearTimeout(timeoutRef.current);
              setPayErr(d.ResultDesc||d.msg||"Payment was not completed. Please try again."); setPayStep("idle");
            }
          } catch { /* keep polling */ }
        },4000);
      } else {
        timeoutRef.current=setTimeout(()=>setPayStep("timeout"),80000);
      }
    } catch { setPayErr("Network error. Check your connection and try again."); setPayStep("idle"); }
  };

  const confirmManualPay=()=>setPayStep("done");

  const handleDone=()=>{ onApplied(job); };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="mh">
          <div>
            <div className="mt">
              {step===0?"Apply for Job":step===1?"Review & Confirm":"Pay Application Fee — KES "+FEE}
            </div>
            <div className="ms">{job.title}</div>
          </div>
          <button className="mclose" onClick={onClose}>×</button>
        </div>

        <div className="mb">

          {/* ── STEP 0: choose town + WhatsApp ── */}
          {step===0 && <>
            <div className="info-box blue" style={{marginBottom:14}}>
              <span>📋</span>
              <div>Choose your preferred town and enter your WhatsApp number. After payment you will be added to the <strong>WorkLink WhatsApp group</strong> where the employer will contact you directly.</div>
            </div>

            <div className="fg">
              <label className="fl">Which town do you want to work in?</label>
              <select
                className={`fsel${errs.town?" err":""}`}
                value={f.town}
                onChange={e=>{ setField("town",e.target.value); if(errs.town) setErrs(p=>({...p,town:""})); }}
              >
                <option value="">Select town / area…</option>
                {ALL_TOWNS.map(t=><option key={t}>{t}</option>)}
              </select>
              {errs.town && <div className="ferr">{errs.town}</div>}
            </div>

            <div className="fg">
              <label className="fl">Your WhatsApp Number</label>
              <input
                className={`finp${errs.waPhone?" err":""}`}
                type="tel" inputMode="numeric"
                placeholder="07XX XXX XXX  or  01XX  or  254XXXXXXXXX"
                value={f.waPhone}
                onChange={e=>{ setField("waPhone",e.target.value.replace(/[^\d]/g,"").slice(0,12)); if(errs.waPhone) setErrs(p=>({...p,waPhone:""})); }}
              />
              {errs.waPhone && <div className="ferr">{errs.waPhone}</div>}
              <div className="fhint">You will be added to the WorkLink WhatsApp group on this number immediately after payment.</div>
            </div>

            {job.accommodation && (
              <div className="info-box green" style={{marginBottom:14}}>
                <span>🏠</span>
                <div><strong>Accommodation available</strong> — {job.accommodationNote}</div>
              </div>
            )}

           
          </>}

          {/* ── STEP 1: summary ── */}
          {step===1 && <>
            <div className="wa-box">
              <div className="wa-title"> You will be added to our WhatsApp group!</div>
              <div className="wa-sub">
                After payment confirmation, your number <strong>{f.waPhone}</strong> will be added to the <strong>WorkLink Kenya Jobs WhatsApp group</strong> where employers contact workers directly. Report to work on <strong>10 July 2026</strong> once contacted.
              </div>
            </div>

            <div className="confirm-list">
              {[
                ["Job Title", job.title],
                ["Preferred Town", f.town],
                ["Salary", job.salary],
                ["Employment Type", job.type],
                ["Start Date", job.start],
                ["Vacancies Available", `${job.vacancies} positions`],
                ["Your WhatsApp", f.waPhone],
                ...(job.accommodation ? [["Accommodation", "✅ Available"]] : []),
              ].map(([k,v])=>(
                <div key={k} className="crow">
                  <span className="ck">{k}</span>
                  <span className="cv">{v}</span>
                </div>
              ))}
            </div>

            <div className="info-box yellow" style={{marginTop:14}}>
              <span>💳</span>
              <div>
                A one-time CONNECT Fee of <strong>KES {FEE}</strong>  is required via M-Pesa on the next screen.
                This adds you to the WhatsApp group and connects you with the employer.
                &nbsp;<a href="#" onClick={e=>e.preventDefault()} style={{color:"#B45309",textDecoration:"underline"}}>Refund Policy</a>
              </div>
            </div>
          </>}

          {/* ── STEP 2: Payment ── */}
          {step===2 && <>
            {payStep==="idle" && <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <div className="mpesa-logo">M-PESA</div>
                  <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>Instant mobile payment</div>
                </div>
                <div className="pay-amount">KES {FEE}</div>
              </div>

              <div className="fg">
                <label className="fl">M-Pesa Number to Charge</label>
                <input
                  className={`finp${payErr?" err":""}`}
                  type="tel" inputMode="numeric"
                  placeholder="07XX XXX XXX  or  01XX  or  254XXXXXXXXX"
                  value={payPhone}
                  onChange={e=>{ setPayPhone(e.target.value.replace(/[^\d]/g,"").slice(0,12)); setPayErr(""); }}
                />
                {payErr && <div className="ferr">{payErr}</div>}
                <div className="fhint">Pre-filled with your registration number. You can edit it to pay from a different line.</div>
              </div>

              <div style={{background:LIGHT,border:`1px solid ${BORDER}`,borderRadius:9,padding:"9px 12px",fontSize:12,color:"#6B7280",lineHeight:1.6,marginBottom:0}}>
                🔐 An M-Pesa STK push will be sent to your phone. Enter your M-Pesa PIN to pay <strong style={{color:NAVY}}>KES {FEE}</strong>. Once confirmed you will be added to the WorkLink WhatsApp group.
              </div>
            </>}

            {payStep==="loading" && (
              <div className="stk-wrap">
                <div className="stk-spin"/>
                <div className="stk-t">Sending M-Pesa push{dots}</div>
                <div className="stk-s">Please wait…</div>
              </div>
            )}

            {payStep==="stk" && (
              <div className="stk-wrap">
                <div className="stk-spin" style={{borderTopColor:GREEN}}/>
                <div className="stk-t">Check your phone{dots}</div>
                <div className="stk-s">
                  STK push sent to <strong style={{color:NAVY}}>{payPhone}</strong>.<br/>
                  Enter your M-Pesa PIN to pay <strong>KES {FEE}</strong>.
                </div>
             
              </div>
            )}

            {payStep==="timeout" && (
              <div className="stk-wrap">
                <div style={{fontSize:32,marginBottom:10}}>⏱️</div>
                <div className="stk-t">Did you complete the payment?</div>
                <div className="stk-s" style={{marginBottom:14}}>
                  If KES {FEE} was deducted from <strong>{payPhone}</strong>, tap Yes to confirm your application.
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                  <button onClick={confirmManualPay} style={{background:GREEN,border:"none",color:"#fff",borderRadius:9,padding:"8px 18px",fontWeight:700,fontSize:12,cursor:"pointer"}}>✅ Yes, I paid</button>
                  <button onClick={()=>{ setPayStep("idle"); setPayErr(""); }} style={{background:LIGHT,border:`1px solid ${BORDER}`,color:SLATE,borderRadius:9,padding:"8px 18px",fontWeight:600,fontSize:12,cursor:"pointer"}}>No, try again</button>
                </div>
              </div>
            )}

            {payStep==="done" && (
              <div className="done-wrap">
                <div className="done-ico">🎉</div>
                <div className="done-t">Payment Confirmed!</div>
                <div className="done-s">
                  Your application for <strong style={{color:NAVY}}>{job.title}</strong> is submitted.<br/>
                  Your WhatsApp number <strong style={{color:NAVY}}>{f.waPhone}</strong> has been noted and you will be added to the <strong>WorkLink WhatsApp group</strong> immediately.<br/><br/>
                  Be ready to report to work on <strong style={{color:NAVY}}>{job.start}</strong> once contacted.
                </div>
              </div>
            )}
          </>}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mf">
          {step===0 && <>
            <button className="btn-out" onClick={onClose} style={{flex:1}}>Cancel</button>
            <button className="btn-full" onClick={goConfirm} style={{flex:2}}>Review Application →</button>
          </>}
          {step===1 && <>
            <button className="btn-out" onClick={()=>setStep(0)} style={{flex:1}}>← Back</button>
            <button className="btn-full" onClick={()=>setStep(2)} style={{flex:2}}>Pay KES {FEE} via M-Pesa →</button>
          </>}
          {step===2 && payStep==="idle" && <>
            <button className="btn-out" onClick={()=>setStep(1)} style={{flex:1}}>← Back</button>
            <button className="btn-full" onClick={startPay} style={{flex:2}}>
              <span className="mpesa-logo" style={{fontSize:12}}>M-PESA</span> Pay KES {FEE}
            </button>
          </>}
          {step===2 && payStep==="done" && (
            <button className="btn-full" onClick={handleDone}>Done — View My Applications</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   LANDING
════════════════════════════════════════ */
function Landing({ onRegister, onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [inView, setInView] = useState(false);
  const heroRef = useRef(null);
  const w = useCountUp(16200, 1800, inView);
  const j = useCountUp(18, 1500, inView);
  const v = useCountUp(1108, 1600, inView);

  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>6);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setInView(true); },{threshold:.25});
    if(heroRef.current) obs.observe(heroRef.current);
    return ()=>obs.disconnect();
  },[]);

  return (
    <>
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="nav-logo"><div className="logo-dot"/>WorkLink Kenya</div>
        <div className="nav-r">
          <button className="btn-ghost" onClick={onLogin}>Sign In</button>
          <button className="btn-blue" onClick={onRegister}>Register Free</button>
        </div>
      </nav>

      <section className="hero" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="hero-badge-i">🇰🇪</div>
            Kenya's No.1 Job Registration Platform
          </div>
          <div className="noexp-badge">✅ No Experience Required — All Kenyans 18+ Welcome</div>
          <h1>Get a Job &amp; <span className="ac">Start Earning</span><br/>Across Kenya</h1>
          <p className="hero-sub">
            Register free, choose your town, and we connect you with employers who will contact you on WhatsApp.
            <strong> All jobs pay KES 30,000+ per month.</strong> Many include free accommodation.
          </p>
          <p className="hero-note"><span>📅</span> All vacancies start <strong>10 July 2026</strong> — apply now!</p>
          <div className="hero-btns">
            <button className="btn-hp" onClick={onRegister}>Register Now — It's Free</button>
            <button className="btn-hs" onClick={onLogin}>Sign In to Apply</button>
          </div>
          <div className="stats-row">
            <div className="stat-pill"><div className="stat-n">{w.toLocaleString()}+</div><div className="stat-l">Workers Registered</div></div>
            <div className="stat-pill"><div className="stat-n">{j}</div><div className="stat-l">Active Job Types</div></div>
            <div className="stat-pill"><div className="stat-n">{v.toLocaleString()}+</div><div className="stat-l">Total Vacancies</div></div>
            <div className="stat-pill"><div className="stat-n">KES 30K+</div><div className="stat-l">Min Monthly Pay</div></div>
          </div>
        </div>
      </section>

      {/* No experience banner */}
      <section className="sec" style={{background:"#fff",paddingTop:36,paddingBottom:36}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div className="noexp-banner">
            <div style={{fontSize:44,flexShrink:0}}>💪</div>
            <div style={{flex:1,minWidth:200}}>
              <h3>No Experience Needed. No Certificates. Just Show Up.</h3>
              <p>WorkLink Kenya is for <strong>ordinary Kenyans aged 18 and above</strong>. Whether you have just finished school, just moved to town, or are looking for your first job — you qualify. Employers provide <strong>full on-the-job training</strong>. Many jobs include <strong>free accommodation and meals</strong>. Register today, apply for a job in your town, pay KES 300 via M-Pesa and you will be <strong>added to our WhatsApp group immediately</strong> where your employer will contact you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="sec" style={{background:LIGHT}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div className="sec-head">
            <div className="sec-lbl">Why WorkLink Kenya</div>
            <div className="sec-title">Built for ordinary Kenyans</div>
            <div className="sec-sub">Simple, honest and straightforward. All jobs are real and paying KES 30,000+.</div>
          </div>
          <div className="why-grid">
            {WHY.map(w=>(
              <div key={w.title} className="why-card">
                <div className="why-ic">{w.icon}</div>
                <div className="why-t">{w.title}</div>
                <div className="why-b">{w.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="sec" style={{background:"#fff"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div className="sec-head">
            <div className="sec-lbl">How It Works</div>
            <div className="sec-title">Four easy steps to your first paycheque</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
            {[
              {n:"01",icon:"📝",t:"Register Free",b:"Create your profile in under 5 minutes. No experience or documents required."},
              {n:"02",icon:"💼",t:"Browse Jobs on Dashboard",b:"After logging in, browse 18+ job listings paying KES 30,000+. Available across all Kenyan towns."},
              {n:"03",icon:"📍",t:"Choose Your Town",b:"When you apply, select the specific town in Kenya where you want to work."},
              {n:"04",icon:"💬",t:"Pay KES 300 & Join WhatsApp",b:"Pay KES 300 via M-Pesa and you are added to our WhatsApp group where your employer contacts you directly."},
            ].map(s=>(
              <div key={s.n} style={{background:"#fff",border:`1.5px solid ${BORDER}`,borderRadius:16,padding:"20px 18px",position:"relative",overflow:"hidden"}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:"2.2rem",color:"rgba(27,111,232,.08)",position:"absolute",top:10,right:14}}>{s.n}</div>
                <div style={{fontSize:30,marginBottom:10}}>{s.icon}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,color:NAVY,marginBottom:5}}>{s.t}</div>
                <div style={{fontSize:12,color:"#6B7280",lineHeight:1.62}}>{s.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-banner">
        <h2>Ready to start earning KES 30,000+ per month?</h2>
        <p>Register free. No experience needed. All Kenyans 18+ welcome. Jobs start 10 July 2026. Many include free accommodation.</p>
        <button className="btn-hp" onClick={onRegister} style={{background:"linear-gradient(135deg,${BLUE},${GREEN})"}}>Register Free Now →</button>
      </div>

      <footer>
        <div className="fl">WorkLink Kenya</div>
        <div className="foot-links">
          {["About","Privacy Policy","Terms","Refund Policy","Contact Us"].map(l=>(
            <a key={l} href="#" onClick={e=>e.preventDefault()}>{l}</a>
          ))}
        </div>
        <p>Connecting Kenyan workers with real employment · Nairobi · Mombasa · Kisumu · Nakuru · Eldoret · and all counties<br/>© 2026 WorkLink Kenya. All rights reserved.</p>
      </footer>
    </>
  );
}

/* ════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════ */
function Dashboard({ user, onLogout, addToast }) {
  const [tab, setTab] = useState("jobs");
  const [applyJob, setApplyJob] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [saved, setSaved] = useState([]);
  const [applied, setApplied] = useState([]);
  const [profileSec, setProfileSec] = useState("info");

  const toggleSave = (id) => {
    const isSaved = saved.includes(id);
    setSaved(s=>isSaved?s.filter(x=>x!==id):[...s,id]);
    addToast(isSaved?"Removed from saved jobs":"Job saved ❤️","");
  };

  const handleApplied = (job) => {
    setApplied(a=>[...a,job.id]);
    setApplyJob(null);
    addToast("Application submitted! Watch your WhatsApp for the group invite. 🎉","✅");
    setTab("applications");
  };

  const totalVacancies = JOBS.reduce((s,j)=>s+j.vacancies,0);

  const visible = JOBS.filter(j=>{
    const ms = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.cat.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter==="All" || j.cat===catFilter;
    return ms && mc;
  });

  return (
    <>
      <nav className="nav scrolled">
        <div className="nav-logo"><div className="logo-dot"/>WorkLink Kenya</div>
        <div className="nav-r">
          <div
            style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"4px 10px",borderRadius:8,border:`1px solid ${BORDER}`}}
            onClick={()=>setTab("profile")}
          >
            <div style={{width:27,height:27,borderRadius:"50%",background:`linear-gradient(135deg,${BLUE},${GREEN})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",flexShrink:0}}>
              {(user.name||"U").charAt(0).toUpperCase()}
            </div>
            <span style={{fontSize:12,fontWeight:600,color:NAVY}}>{(user.name||"").split(" ")[0]}</span>
          </div>
          <button className="btn-ghost" onClick={onLogout} style={{fontSize:12}}>Sign Out</button>
        </div>
      </nav>

      <div className="dash-nav">
        {[
          ["jobs","💼 Jobs"],
          ["applications",`📋 Applied${applied.length?` (${applied.length})`:""}`],
          ["saved",`❤️ Saved${saved.length?` (${saved.length})`:""}`],
          ["profile","👤 Profile"],
        ].map(([k,l])=>(
          <button key={k} className={`dnav-btn${tab===k?" active":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      <div className="dw">

        {/* ══ JOBS ══ */}
        {tab==="jobs" && <>
          <div className="welcome">
            <div className="whi">Hello, {(user.name||"Worker").split(" ")[0]} 👋</div>
            <div className="wsub">{JOBS.length} job types · {totalVacancies}+ vacancies · All starting 10 July 2026 · KES 30,000+/month</div>
          </div>

          <div className="ds-grid">
            {[
              {ico:"💼",n:JOBS.length,l:"Job Types"},
              {ico:"👥",n:totalVacancies+"+",l:"Total Vacancies"},
              {ico:"📋",n:applied.length,l:"My Applications"},
              {ico:"📅",n:"10 Jul",l:"Jobs Start"},
            ].map(d=>(
              <div key={d.l} className="dsc">
                <div className="dsc-ico">{d.ico}</div>
                <div className="dsc-n" style={{fontSize:typeof d.n==="string"&&d.n.length>5?"1.1rem":undefined}}>{d.n}</div>
                <div className="dsc-l">{d.l}</div>
              </div>
            ))}
          </div>

          <div className="s-row">
            <div className="sbox">
              <span className="sico">🔍</span>
              <input placeholder="Search jobs by title or category…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",fontSize:16}}>×</button>}
            </div>
          </div>

          <div className="ftabs">
            {ALL_CATS.map(c=>(
              <button key={c} className={`ftab${catFilter===c?" on":""}`} onClick={()=>setCatFilter(c)}>{c}</button>
            ))}
          </div>

          {visible.length===0 ? (
            <div className="empty">
              <div className="empty-ico">🔍</div>
              <h4>No jobs found</h4>
              <p>Try a different search term or clear the filter.</p>
            </div>
          ) : (
            <div className="jgrid">
              {visible.map(j=>(
                <div key={j.id} className="jcard">
                  {applied.includes(j.id) && <div className="applied-ribbon">Applied ✓</div>}
                  <button className={`jcard-fav${saved.includes(j.id)?" on":""}`} onClick={()=>toggleSave(j.id)} title={saved.includes(j.id)?"Remove from saved":"Save job"}>
                    {saved.includes(j.id)?"❤️":"🤍"}
                  </button>
                  <div className="jc-ico">{j.icon}</div>
                  <div className="jc-cat">{j.cat}</div>
                  <div className="jc-title">{j.title}</div>
                  <div className="jc-desc">{j.desc}</div>
                  {j.accommodation && (
                    <div className="jc-accom">
                      <span>🏠</span> Accommodation may be offered
                    </div>
                  )}
                  <div className="jc-meta">
                    <div className="jcm">📍 <strong>All towns across Kenya</strong></div>
                    <div className="jcm">📅 Starts: <strong>{j.start}</strong></div>
                    <div className="jcm">⏰ Apply by: <strong>{daysLeft(j.deadline)}</strong></div>
                  </div>
                  <div className="jc-tags">
                    <span className="tag tag-blue">{j.type}</span>
                    {j.accommodation && <span className="tag tag-green">Accommodation</span>}
                    {applied.includes(j.id) && <span className="tag tag-purple">Applied ✓</span>}
                  </div>
                  <div className="jc-salary">{j.salary}</div>
                  <div className="jc-vacancies">
                    <span>🔴</span> {j.vacancies} vacancies available
                  </div>
                  <button
                    className={`btn-apply${applied.includes(j.id)?" applied":""}`}
                    disabled={applied.includes(j.id)}
                    onClick={()=>setApplyJob(j)}
                  >
                    {applied.includes(j.id)?"Applied ✓":"Apply Now →"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>}

        {/* ══ APPLICATIONS ══ */}
        {tab==="applications" && <>
          <div style={{marginBottom:20}}>
            <div className="sec-lbl">My Applications</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"clamp(1.15rem,2.5vw,1.4rem)",color:NAVY}}>Track your job applications</div>
          </div>
          {applied.length===0 ? (
            <div className="empty">
              <div className="empty-ico">📋</div>
              <h4>No applications yet</h4>
              <p>Browse jobs and tap "Apply Now" to submit your application.</p>
              <button className="btn-blue" style={{marginTop:16,padding:"8px 20px"}} onClick={()=>setTab("jobs")}>Browse Jobs →</button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {JOBS.filter(j=>applied.includes(j.id)).map(j=>(
                <div key={j.id} style={{background:"#fff",border:`1.5px solid ${BORDER}`,borderRadius:14,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
                  <div style={{fontSize:28,flexShrink:0}}>{j.icon}</div>
                  <div style={{flex:1,minWidth:140}}>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,color:NAVY,marginBottom:2}}>{j.title}</div>
                    <div style={{fontSize:11,color:"#9CA3AF"}}>All towns · {j.type} · Starts {j.start}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,color:GREEN,fontSize:12}}>{j.salary}</span>
                    <span style={{background:"#D1FAE5",border:"1px solid #A7F3D0",borderRadius:99,padding:"2px 9px",fontSize:9,fontWeight:700,color:"#065F46"}}>✓ Application Sent</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>}

        {/* ══ SAVED ══ */}
        {tab==="saved" && <>
          <div style={{marginBottom:20}}>
            <div className="sec-lbl">Saved Jobs</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"clamp(1.15rem,2.5vw,1.4rem)",color:NAVY}}>Jobs you've bookmarked</div>
          </div>
          {saved.length===0 ? (
            <div className="empty">
              <div className="empty-ico">❤️</div>
              <h4>No saved jobs yet</h4>
              <p>Tap the heart icon on any job card to save it.</p>
              <button className="btn-blue" style={{marginTop:16,padding:"8px 20px"}} onClick={()=>setTab("jobs")}>Browse Jobs →</button>
            </div>
          ) : (
            <div className="jgrid">
              {JOBS.filter(j=>saved.includes(j.id)).map(j=>(
                <div key={j.id} className="jcard">
                  {applied.includes(j.id) && <div className="applied-ribbon">Applied ✓</div>}
                  <button className="jcard-fav on" onClick={()=>toggleSave(j.id)}>❤️</button>
                  <div className="jc-ico">{j.icon}</div>
                  <div className="jc-cat">{j.cat}</div>
                  <div className="jc-title">{j.title}</div>
                  <div className="jc-salary">{j.salary}</div>
                  <div className="jc-vacancies"><span>🔴</span>{j.vacancies} vacancies</div>
                  {j.accommodation && <div className="jc-accom"><span>🏠</span>Accommodation may be offered</div>}
                  <button
                    className={`btn-apply${applied.includes(j.id)?" applied":""}`}
                    disabled={applied.includes(j.id)}
                    onClick={()=>setApplyJob(j)}
                  >
                    {applied.includes(j.id)?"Applied ✓":"Apply Now →"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>}

        {/* ══ PROFILE ══ */}
        {tab==="profile" && <>
          <div style={{marginBottom:20}}>
            <div className="sec-lbl">My Profile</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"clamp(1.15rem,2.5vw,1.4rem)",color:NAVY}}>Manage your account</div>
          </div>
          <div className="pgrid">
            <div className="pside">
              <div className="pside-cov"/>
              <div className="pside-body">
                <div className="pside-av">{(user.name||"U").charAt(0).toUpperCase()}</div>
                <div className="pside-name">{user.name||"Worker"}</div>
                <div className="pside-sub">{user.phone||"—"}</div>
                <div className="pmenu">
                  {[
                    {id:"info",icon:"👤",label:"Personal Information"},
                    {id:"apps",icon:"📋",label:`My Applications (${applied.length})`},
                    {id:"support",icon:"💬",label:"Support"},
                    {id:"settings",icon:"⚙️",label:"Settings"},
                  ].map(m=>(
                    <div key={m.id} className={`pmi${profileSec===m.id?" active":""}`} onClick={()=>setProfileSec(m.id)}>
                      <span>{m.icon}</span>{m.label}
                    </div>
                  ))}
                  <div className="pmi red" onClick={onLogout}><span>🚪</span>Sign Out</div>
                </div>
              </div>
            </div>

            <div>
              {profileSec==="info" && (
                <div className="pinfo">
                  <div className="pinfo-title">Personal Information</div>
                  <div className="info-grid">
                    {[
                      ["Full Name",user.name||"—"],
                      ["Phone",user.phone||"—"],
                      ["Gender",user.gender||"—"],
                      ["Age",user.age||"—"],
                      ["Education",user.education||"—"],
                    ].map(([l,v])=>(
                      <div key={l} className="inf-f">
                        <div className="il">{l}</div>
                        <div className="iv">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:16,padding:"12px 14px",background:"#D1FAE5",border:"1px solid #6EE7B7",borderRadius:10,fontSize:12,color:"#065F46",fontWeight:600}}>
                    📲 After applying and paying KES 300, your WhatsApp number will be added to our group where employers contact you.
                  </div>
                </div>
              )}
              {profileSec==="apps" && (
                <div className="pinfo">
                  <div className="pinfo-title">My Applications ({applied.length})</div>
                  {applied.length===0 ? (
                    <div className="empty" style={{padding:"24px 0"}}>
                      <p>No applications yet. <button style={{background:"none",border:"none",cursor:"pointer",color:BLUE,fontWeight:700,fontSize:13}} onClick={()=>{ setTab("jobs"); }}>Browse jobs →</button></p>
                    </div>
                  ) : JOBS.filter(j=>applied.includes(j.id)).map(j=>(
                    <div key={j.id} style={{padding:"10px 0",borderBottom:`1px solid ${BORDER}`,display:"flex",gap:9,alignItems:"center"}}>
                      <span style={{fontSize:18}}>{j.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:12,color:NAVY}}>{j.title}</div>
                        <div style={{fontSize:10,color:"#9CA3AF"}}>All towns · {j.salary}</div>
                      </div>
                      <span style={{fontSize:10,fontWeight:700,color:GREEN}}>✓ Submitted</span>
                    </div>
                  ))}
                </div>
              )}
              {profileSec==="support" && (
                <div className="pinfo">
                  <div className="pinfo-title">Support & Help</div>
                  {[
                    {ic:"📞",l:"Call us",v:"0800 720 999 (Toll free)"},
                    {ic:"💬",l:"WhatsApp",v:"+254 712 000 000"},
                    {ic:"📧",l:"Email",v:"support@worklink.co.ke"},
                  ].map(c=>(
                    <div key={c.l} style={{display:"flex",gap:10,alignItems:"center",padding:"11px 12px",background:LIGHT,borderRadius:10,border:`1px solid ${BORDER}`,marginBottom:8}}>
                      <span style={{fontSize:20}}>{c.ic}</span>
                      <div>
                        <div style={{fontSize:9,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>{c.l}</div>
                        <div style={{fontSize:13,fontWeight:700,color:NAVY}}>{c.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {profileSec==="settings" && (
                <div className="pinfo">
                  <div className="pinfo-title">Settings</div>
                  {[
                    {l:"SMS Job Alerts",d:"Get new job notifications via SMS",on:true},
                    {l:"WhatsApp Notifications",d:"Receive updates on your WhatsApp",on:true},
                    {l:"Profile Visible to Employers",d:"Allow employers to see your profile",on:true},
                  ].map(s=>(
                    <div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"12px 0",borderBottom:`1px solid ${BORDER}`,gap:10}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:13,color:NAVY}}>{s.l}</div>
                        <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{s.d}</div>
                      </div>
                      <div style={{width:38,height:21,borderRadius:99,background:s.on?BLUE:"#D1D5DB",position:"relative",cursor:"pointer",flexShrink:0}}>
                        <div style={{position:"absolute",top:2,left:s.on?18:2,width:17,height:17,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>}

      </div>

      {applyJob && (
        <ApplyModal
          job={applyJob}
          userPhone={user.phone||""}
          onClose={()=>setApplyJob(null)}
          onApplied={handleApplied}
          addToast={addToast}
        />
      )}
    </>
  );
}

/* ════════════════════════════════════════
   ROOT
════════════════════════════════════════ */
export default function WorkLinkKenya() {
  const [screen, setScreen] = useState("landing");
  const [showReg, setShowReg] = useState(false);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg,icon="ℹ️")=>{
    const id=++_tid;
    setToasts(p=>[...p,{id,msg,icon}]);
  },[]);
  const removeToast = useCallback((id)=>setToasts(p=>p.filter(t=>t.id!==id)),[]);

  const handleRegDone = (data) => {
    setShowReg(false);
    setUser(data);
    setScreen("dashboard");
    addToast(`Welcome ${data.name.split(" ")[0]}! Browse and apply for jobs now. 🎉`,"👋");
  };

  const handleLogin = () => {
    // Demo login — replace with real auth
    setUser({ name:"Jane Wanjiku", phone:"0712345678", gender:"Female", age:"26", education:"Secondary (KCSE)" });
    setScreen("dashboard");
    addToast("Welcome back! Browse jobs and apply. 👋","✅");
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{overflowY:"auto",height:"100vh"}}>
        {screen==="landing" && (
          <Landing onRegister={()=>setShowReg(true)} onLogin={handleLogin}/>
        )}
        {screen==="dashboard" && user && (
          <Dashboard user={user} onLogout={()=>{ setScreen("landing"); setUser(null); }} addToast={addToast}/>
        )}
      </div>
      {showReg && <RegisterModal onClose={()=>setShowReg(false)} onDone={handleRegDone}/>}
      <Toasts list={toasts} remove={removeToast}/>
    </>
  );
}