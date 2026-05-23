import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-12 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Take control of your subscriptions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          SmartSub automatically detects recurring payments from your bank
          transactions and helps you track spending, avoid surprises, and save
          money.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/upload"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Upload Transactions
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Detect Subscriptions", desc: "Automatically find recurring charges in your transactions." },
          { title: "Payment Reminders", desc: "Get notified before upcoming subscription payments." },
          { title: "Spending Overview", desc: "See exactly how much you spend on subscriptions monthly." },
          { title: "Potential Savings", desc: "Identify subscriptions you could cancel or downgrade." },
        ].map((b) => (
          <div key={b.title} className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
            <p className="text-sm text-gray-600">{b.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
