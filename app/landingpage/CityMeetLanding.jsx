"use client"

import React from 'react';
import NewsSection from '../components/NewsSection';

const CityMeetLandingPage = () => {
  return (
    <div className="citymeet-app">
      {/* Header - Keeping your existing header */}
      

      {/* Main Navigation - This is the only navbar we're keeping */}


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main content area - News section */}
          <div className="col-span-8">
            {/* We'll keep the NewsSection component which includes the category tabs */}
            <NewsSection />
          </div>
          
          {/* Sidebar */}
          <div className="col-span-4">
            {/* About section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">About CityMeet</h2>
              <p className="text-gray-600 mb-2">
                Connecting communities, sharing resources, and making cities better together.
              </p>
            </div>
            
            {/* Important Updates section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">Important Updates</h2>
              
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded mb-2">
                  Alert
                </div>
                <h3 className="font-medium mb-1">Community Clean-up Drive</h3>
                <p className="text-sm text-gray-600">Join us this weekend for the annual city clean-up initiative...</p>
              </div>
              
              <div className="mb-2">
                <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded mb-2">
                  Event
                </div>
                <h3 className="font-medium mb-1">Local Food Festival</h3>
                <p className="text-sm text-gray-600">Experience diverse cuisines at the downtown food festival...</p>
              </div>
            </div>

            {/* Quick Links section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green-700">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Press</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Community Guidelines</a></li>
              </ul>
            </div>
            
            {/* Legal section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Legal</h2>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green-700">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-10 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            &copy; 2025 CityMeet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CityMeetLandingPage;