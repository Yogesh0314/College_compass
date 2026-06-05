'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplicationModal from '@/components/ui/ApplicationModal';
import { 
  MapPin, Star, GraduationCap, Clock, 
  IndianRupee, Briefcase, Award, Sparkles,
  ShieldCheck, Zap, TrendingUp, Send, User, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { College, Course, Review } from '@/types';

export default function CollegeDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Review Form State
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchCollege = async () => {
    try {
      const res = await fetch(`/api/colleges/${id}`);
      const data = await res.json();
      setCollege(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeId: id,
          content: reviewContent,
          rating: reviewRating
        })
      });

      const data = await res.json();

      if (res.ok) {
        setReviewContent('');
        setReviewRating(5);
        fetchCollege(); // Refresh college data to show new review and updated rating
      } else {
        setReviewError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setReviewError('Something went wrong. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Analyzing Institution</p>
    </div>
  );

  if (!college) return <div>College not found</div>;

  // AI Insight Heuristics
  const isTopTier = college.rating >= 4.7;
  const isValueForMoney = college.fees < 150000 && college.placementRate > 85;
  const placementStatus = college.placementRate > 90 ? 'Stellar' : college.placementRate > 80 ? 'Excellent' : 'Good';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Modern Header */}
        <section className="bg-gray-900 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-8">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white/5 text-blue-400 shadow-inner backdrop-blur-xl border border-white/10">
                  {college.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={college.image} 
                      alt={college.name} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <GraduationCap className="h-14 w-14" />
                  )}
                </div>
                <div>
                   <div className="mb-3 flex items-center gap-2">
                     <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                       Tier {isTopTier ? '1' : '2'} Institute
                     </span>
                     <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold">{college.rating.toFixed(1)}</span>
                     </div>
                   </div>
                   <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">{college.name}</h1>
                   <div className="flex items-center gap-4 text-gray-400 font-medium">
                     <div className="flex items-center gap-1.5">
                       <MapPin className="h-4 w-4 text-blue-500" />
                       {college.location}
                     </div>
                     <span className="h-1 w-1 rounded-full bg-gray-700" />
                     <div className="flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-blue-500" />
                        Accredited
                     </div>
                   </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                 <button 
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/20 active:scale-95"
                 >
                   Apply Now
                 </button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto -mt-10 px-4 pb-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                 {[
                   { label: 'Annual Fees', val: `₹${(college.fees/1000).toFixed(0)}k`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
                   { label: 'Placement', val: `${college.placementRate}%`, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                   { label: 'Duration', val: '4 Years', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
                   { label: 'Mode', val: 'Full-Time', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' }
                 ].map((stat, i) => (
                   <div key={i} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-2xl", stat.bg, stat.color)}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <p className="text-2xl font-black text-gray-900">{stat.val}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">{stat.label}</p>
                   </div>
                 ))}
              </div>

              {/* AI Insights Section (Internship Requirement) */}
              <div className="rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="h-32 w-32 text-blue-600" />
                 </div>
                 <div className="relative z-10">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white">
                       <Zap className="h-3.5 w-3.5" />
                       AI Analysis
                    </div>
                    <h2 className="mb-6 text-3xl font-black text-gray-900">Institution Verdict</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <TrendingUp className="h-5 w-5 text-blue-600" />
                             <span className="text-lg font-bold text-gray-800">Placement Outlook: <span className="text-blue-600">{placementStatus}</span></span>
                          </div>
                          <p className="text-gray-600 leading-relaxed font-medium">
                            Based on our data models, {college.name} shows a consistent upward trend in high-CTC placements, especially for the {college.courses[0]?.name || 'Engineering'} branch.
                          </p>
                       </div>
                       <div className="space-y-4 border-l border-blue-200 pl-8">
                          <div className="flex items-center gap-3">
                             <ShieldCheck className="h-5 w-5 text-green-600" />
                             <span className="text-lg font-bold text-gray-800">Value Rating: <span className="text-green-600">{isValueForMoney ? 'Excellent' : 'Stable'}</span></span>
                          </div>
                          <p className="text-gray-600 leading-relaxed font-medium">
                            {isValueForMoney 
                             ? "This institution offers exceptional return-on-investment given its low fee structure and high placement success."
                             : "The fee structure is justified by the modern infrastructure and global alumni network provided by the institute."}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* About Section */}
              <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm">
                <h2 className="mb-6 text-2xl font-black text-gray-900">Overview</h2>
                <p className="text-lg leading-relaxed text-gray-500 font-medium">
                  {college.description}
                </p>
              </div>

              {/* Courses Section */}
              <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm">
                <h2 className="mb-8 text-2xl font-black text-gray-900">Available Programs</h2>
                <div className="space-y-4">
                  {college.courses.map((course: Course) => (
                    <div key={course.id} className="flex items-center justify-between rounded-2xl border border-gray-50 bg-gray-50/50 p-6 transition-all hover:border-blue-200 hover:bg-white group">
                      <div>
                        <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{course.name}</p>
                        <p className="text-sm font-medium text-gray-400">{course.duration} • Full Time</p>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black text-gray-900">₹{(course.fees/1000).toFixed(0)}k</p>
                         <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Per Year</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Student Reviews</h2>
                    <p className="text-sm font-medium text-gray-400">What current students think about {college.name}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-6 py-3 border border-amber-100">
                    <Star className="h-5 w-5 fill-current text-amber-500" />
                    <span className="text-xl font-black text-amber-600">{college.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="mb-12 rounded-3xl bg-gray-50 p-8">
                  <h3 className="mb-6 text-lg font-bold text-gray-900">Share your experience</h3>
                  
                  {reviewError && (
                    <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-500 border border-red-100">
                      {reviewError}
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-400">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                            reviewRating >= star ? "bg-amber-500 text-white shadow-lg shadow-amber-100" : "bg-white text-gray-300 border border-gray-100"
                          )}
                        >
                          <Star className={cn("h-5 w-5", reviewRating >= star && "fill-current")} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-400">Your Review</label>
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Share your thoughts about placements, campus life, faculty..."
                      required
                      className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-white p-5 font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-black text-white transition-all hover:bg-blue-600 disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                    <Send className="h-4 w-4" />
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-6">
                  {college.reviews && college.reviews.length > 0 ? (
                    college.reviews.map((review: Review) => (
                      <div key={review.id} className="rounded-3xl border border-gray-50 bg-white p-8 shadow-sm transition-all hover:border-blue-100">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{review.user?.name || 'Anonymous Student'}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 font-bold text-amber-500 border border-amber-50">
                            <Star className="h-4 w-4 fill-current" />
                            {review.rating}
                          </div>
                        </div>
                        <p className="text-lg leading-relaxed text-gray-600 font-medium italic">
                          "{review.content}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[2.5rem] border-2 border-dashed border-gray-50 p-12 text-center">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-200">
                        <MessageSquare className="h-8 w-8" />
                      </div>
                      <h3 className="mb-2 text-xl font-black text-gray-900">No reviews yet.</h3>
                      <p className="text-gray-400 font-medium">Be the first one to share your experience!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-8">
              <div className="rounded-[2.5rem] bg-gray-900 p-10 text-white shadow-2xl">
                 <h3 className="mb-6 text-xl font-bold">Admission Inquiry</h3>
                 <p className="mb-8 text-gray-400 font-medium">Get a detailed brochure and talk to our career experts about admissions.</p>
                 <div className="space-y-4">
                   <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-5 text-sm font-black transition-all hover:bg-blue-700 active:scale-95">
                     Download Brochure
                   </button>
                   <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-5 text-sm font-black transition-all hover:bg-white/10 active:scale-95">
                     Talk to Expert
                   </button>
                 </div>
              </div>

              {/* Quick Info Card */}
              <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm">
                <h3 className="mb-6 text-xl font-bold text-gray-900">Key Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">University Type</p>
                      <p className="text-sm font-medium text-gray-500">Autonomous Institute</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">NAAC Grade</p>
                      <p className="text-sm font-medium text-gray-500">A++ Accredited</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        collegeName={college.name} 
      />
    </div>
  );
}
