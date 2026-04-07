
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter text-indigo-600">TREST.</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Products</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Vendors</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-lg">Login</Link>
            <Link href="/register" className="text-sm font-bold bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-20">
        <section className="max-w-4xl mx-auto text-center px-6 py-24 space-y-10">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest animate-fade-in">
            Revolutionizing Ecommerce
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-gray-900">
            Build your <span className="text-indigo-600">multi-vendor</span> empire.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The most advanced ecommerce platform for modern business. Scale faster, sell smarter, and win bigger with Trest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link href="/register" className="w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95">
              Start Your Store
            </Link>
            <Link href="/register" className="w-full sm:w-auto bg-white border-2 border-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all">
              Join as Buyer
            </Link>
          </div>
        </section>

        {/* Feature grid placeholder */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Global Reach", desc: "Sell to customers anywhere in the world with localized payments." },
            { title: "Advanced Analytics", desc: "Real-time insights into your store's performance." },
            { title: "Fast Shipping", desc: "Integrated logistics for seamless delivery experience." }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-gray-50 rounded-[2rem] border border-gray-100/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl mb-6 shadow-xl shadow-indigo-100 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                0{i+1}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm font-medium">
          &copy; 2026 Trest Ecommerce. Built for excellence.
        </div>
      </footer>
    </div>
  );
}
