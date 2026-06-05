export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-gray-900">College Compass</h2>
            <p className="text-sm text-gray-500">Helping students navigate their future.</p>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Explore</span>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Top Colleges</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Browse by Location</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Support</span>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Help Center</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} College Compass. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
