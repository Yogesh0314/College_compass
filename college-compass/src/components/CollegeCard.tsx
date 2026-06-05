'use client';

import Link from 'next/link';
import { MapPin, Star, GraduationCap, ArrowRight, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    placementRate: number;
    image?: string;
  };
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export default function CollegeCard({ college, isSaved, onToggleSave }: CollegeCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {college.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={college.image} 
            alt={college.name} 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-50">
            <GraduationCap className="h-12 w-12 text-blue-200" />
          </div>
        )}
        <button 
          onClick={() => onToggleSave?.(college.id)}
          className={cn(
            "absolute right-4 top-4 rounded-full p-2 shadow-sm transition-all",
            isSaved ? "bg-red-50 text-red-500" : "bg-white text-gray-400 hover:text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
            Engineering
          </span>
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            {college.rating}
          </div>
        </div>

        <h3 className="mb-1 line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-blue-600">
          {college.name}
        </h3>
        
        <div className="mb-4 flex items-center gap-1 text-sm font-bold text-gray-700">
          <MapPin className="h-4 w-4 text-blue-500" />
          {college.location}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 border-y py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Avg Fees</p>
            <p className="font-bold text-gray-900">₹{college.fees.toLocaleString()}/yr</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Placement</p>
            <p className="font-bold text-gray-900">{college.placementRate}%</p>
          </div>
        </div>

        <Link 
          href={`/colleges/${college.id}`}
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-black text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
