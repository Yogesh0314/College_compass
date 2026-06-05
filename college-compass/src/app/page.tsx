import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { cn } from '@/lib/utils';
import { Search, MapPin, Sparkles, Loader2, ArrowRight, GraduationCap, Users, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden bg-gray-900 py-24 text-white md:py-32">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 z-0 opacity-40">
             <div className="absolute -left-1/4 -top-1/4 h-full w-full rounded-full bg-blue-600 blur-[120px] animate-pulse"></div>
             <div className="absolute -right-1/4 -bottom-1/4 h-full w-full rounded-full bg-purple-600 blur-[120px] animate-pulse delay-700"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-blue-200">The #1 College Discovery & Prediction Platform</span>
            </div>
            
            <h1 className="mb-8 text-5xl font-black tracking-tighter md:text-8xl lg:leading-[1.1]">
              Your Future <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Starts Here.</span>
            </h1>
            
            <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-gray-400 md:text-xl md:leading-relaxed">
              Skip the guesswork. Compare 200+ metrics across top engineering institutions and make the most important decision of your life with confidence.
            </p>

            <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row justify-center">
              <Link 
                href="/colleges"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-10 py-5 text-lg font-black transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95"
              >
                Explore Colleges
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/compare"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-black backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
              >
                Compare Now
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-20 grid grid-cols-2 gap-8 border-t border-white/5 pt-12 md:grid-cols-4">
               {[
                 { label: 'Institutions', val: '50+', icon: GraduationCap },
                 { label: 'Monthly Visitors', val: '10k+', icon: Users },
                 { label: 'Placement Support', val: '100%', icon: Sparkles },
                 { label: 'Global Rankings', val: 'Yes', icon: Globe }
               ].map((stat, i) => (
                 <div key={i} className="text-center">
                    <p className="text-3xl font-black text-white">{stat.val}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Features / Why Choose Us */}
        <section className="bg-gray-50 py-24">
          <div className="container mx-auto px-4">
             <div className="mb-16 text-center">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Why College Compass?</h2>
                <p className="text-gray-500 font-medium max-w-xl mx-auto">We provide the most accurate and up-to-date data for engineering aspirants across top institutions in India.</p>
             </div>
             
             <div className="grid gap-8 md:grid-cols-3">
                {[
                  { 
                    title: 'Verified Data', 
                    desc: 'Direct feeds from AICTE and university databases ensures you see only verified fees and stats.',
                    color: 'bg-blue-500'
                  },
                  { 
                    title: 'Student Voice', 
                    desc: 'Read real reviews from current students and alumni to get the ground reality of any campus.',
                    color: 'bg-purple-500'
                  },
                  { 
                    title: 'Direct Apply', 
                    desc: 'Express interest directly to multiple colleges with a single click and get expert counseling.',
                    color: 'bg-cyan-500'
                  }
                ].map((feat, i) => (
                  <div key={i} className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                     <div className={cn("mb-6 h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", feat.color)}>
                        <Sparkles className="h-6 w-6" />
                     </div>
                     <h3 className="mb-4 text-xl font-bold text-gray-900">{feat.title}</h3>
                     <p className="leading-relaxed text-gray-500 font-medium">{feat.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
