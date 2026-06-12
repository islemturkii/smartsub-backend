import Link from "next/link";

const benefits = [
  { icon: "📊", title: "Detect Subscriptions", desc: "Automatically find recurring charges hidden in your bank transactions." },
  { icon: "🔔", title: "Payment Reminders", desc: "Know exactly when your next payment is due — no more surprises." },
  { icon: "💰", title: "Spending Overview", desc: "See your true monthly subscription cost at a glance." },
  { icon: "✂️", title: "Find Savings", desc: "Identify subscriptions you could cancel, downgrade, or review." },
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center pt-16 pb-4 space-y-6">
        <p className="text-sm font-medium text-indigo-600 tracking-wide uppercase">Subscription Intelligence</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Take control of your<br />
          <span className="text-indigo-600">recurring payments</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Upload your bank transactions and SmartSub instantly detects subscriptions,
          tracks spending, and shows you where you can save money.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            href="/upload"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
          >
            Upload Transactions →
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-center text-xl font-bold text-gray-900">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          {[
            { step: "1", title: "Upload CSV", desc: "Export transactions from your bank and upload the CSV file." },
            { step: "2", title: "Auto-Detect", desc: "SmartSub analyzes patterns and detects recurring subscriptions." },
            { step: "3", title: "Save Money", desc: "Review your dashboard, spot savings, and take control." },
          ].map((s) => (
            <div key={s.step} className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center mx-auto">
                {s.step}
              </div>
              <h3 className="font-semibold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {benefits.map((b) => (
          <div key={b.title} className="bg-white rounded-xl p-6 border hover:shadow-md transition">
            <span className="text-2xl">{b.icon}</span>
            <h3 className="font-semibold text-gray-900 mt-3 mb-1">{b.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
