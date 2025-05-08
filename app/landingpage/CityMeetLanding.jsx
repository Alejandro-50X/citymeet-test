'use client'

import React from 'react'
import Link from 'next/link'

export default function CityMeetLanding() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Content area with sidebar */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content area */}
          <div className="w-full md:w-3/4">
            {/* Important Updates Section */}
            <h2 className="text-2xl font-bold mb-6">Important Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Clean-up Drive Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="inline-block bg-green-900 text-white text-sm px-3 py-1 rounded-full mb-4">
                  Alert
                </div>
                <h3 className="text-lg font-semibold mb-2">Community Clean-up Drive</h3>
                <p className="text-gray-600">
                  Join us this weekend for the annual city clean-up initiative...
                </p>
              </div>

              {/* Food Festival Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="inline-block bg-green-900 text-white text-sm px-3 py-1 rounded-full mb-4">
                  Event
                </div>
                <h3 className="text-lg font-semibold mb-2">Local Food Festival</h3>
                <p className="text-gray-600">
                  Experience diverse cuisines at the downtown food festival...
                </p>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button className="bg-green-900 text-white px-4 py-2 rounded-lg">All</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Events</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Jobs</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">News</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Resources</button>
            </div>
            
            {/* Feed Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Community Park Post */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 h-48"></div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">New Community Park Opening</h3>
                  <p className="text-gray-600 mb-4">Check out the newly renovated Washington Square Park...</p>
                  
                  <div className="flex items-center text-gray-500 text-sm gap-4">
                    <div className="flex items-center gap-1">
                      <span>245</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>18</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Job Opening Post */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">Mike Chen</p>
                      <p className="text-sm text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-2">Job Opening: Web Developer</h3>
                    <p className="text-gray-600 mb-4">Local tech startup looking for a full-stack developer...</p>
                    <button className="bg-green-900 text-white px-4 py-2 rounded-lg">Apply Now</button>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm gap-4">
                    <div className="flex items-center gap-1">
                      <span>128</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>32</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About CityMeet</h3>
                <p className="text-gray-600 text-sm">
                  Connecting communities, sharing resources, and making cities better together.
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="#" className="hover:text-gray-900">About Us</Link></li>
                  <li><Link href="#" className="hover:text-gray-900">Careers</Link></li>
                  <li><Link href="#" className="hover:text-gray-900">Press</Link></li>
                  <li><Link href="#" className="hover:text-gray-900">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-gray-900">Community Guidelines</Link></li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="#" className="hover:text-gray-900">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-gray-900">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-gray-900">Cookie Policy</Link></li>
                  <li><Link href="#" className="hover:text-gray-900">Accessibility</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    <div className="w-5 h-5 bg-gray-600"></div>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    <div className="w-5 h-5 bg-gray-600"></div>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    <div className="w-5 h-5 bg-gray-600"></div>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    <div className="w-5 h-5 bg-gray-600"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}