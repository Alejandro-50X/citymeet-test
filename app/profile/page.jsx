import Nav from "../components/Nav";
import SignOutButton from "../components/SignOutButton";

export default function Profile()
{
    return(
    <main className="min-h-screen bg-gray-800  relative p-10">
            <Nav />
    
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col items-center mb-6">
                    <h1 className="text-4xl font-bold mb-4 text-white">Profile</h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar - Today's Summary and My Groups */}
          <div className="lg:col-span-3 space-y-4">
            {/* Today's Summary Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-5 h-4 bg-green-900 mr-2"></div>
                  <p className="text-sm">12 new posts in your groups</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-900 mr-2"></div>
                  <p className="text-sm">3 upcoming events</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-900 mr-2"></div>
                  <p className="text-sm">5 new job postings</p>
                </div>
              </div>
            </div>

            {/* My Groups Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">My Groups</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-5 h-4 bg-green-900 mr-2"></div>
                  <p className="text-sm">LA Tech Community</p>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-900 mr-2"></div>
                  <p className="text-sm">Griffith Park Hikers</p>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-900 mr-2"></div>
                  <p className="text-sm">Downtown Art Scene</p>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-900 mr-2"></div>
                  <p className="text-sm">LA Foodies</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle section - Posts */}
          <div className="lg:col-span-6 space-y-4">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex border-b border-gray-200">
                <div className="px-6 py-3 border-b-2 border-green-900 text-green-900 font-medium">Posts</div>
                <div className="px-6 py-3 text-gray-500">Media</div>
                <div className="px-6 py-3 text-gray-500">Likes</div>
                <div className="px-6 py-3 text-gray-500">Saved</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">Filter by:</span>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                  <span className="text-sm mr-2">All Types</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                  <span className="text-sm mr-2">This Month</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </button>
              </div>
            </div>

            {/* Post 1 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <img className="w-10 h-10 rounded-full mr-3" src="https://placehold.co/40x40" alt="Profile" />
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <p className="mb-4">Just discovered this amazing new coffee shop in Downtown LA! Great atmosphere and even better coffee. #LAFoodie #CoffeeLovers</p>
                <img className="w-full h-auto rounded-lg mb-3" src="https://placehold.co/580x256" alt="Coffee shop" />
                <div className="flex space-x-4">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                    <span>245</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                    <span>32</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Post 2 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <img className="w-10 h-10 rounded-full mr-3" src="https://placehold.co/40x40" alt="Profile" />
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>
                </div>
                <p className="mb-4">Looking for recommendations for affordable housing in the Silver Lake area. Any suggestions? #LAHousing #SilverLake</p>
                <div className="flex space-x-4">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                    <span>56</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                    <span>28</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - User Profile */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img className="w-full h-32 object-cover" src="https://placehold.co/294x128" alt="Cover" />
                <img className="w-20 h-20 rounded-full border-4 border-white absolute bottom-0 transform translate-y-1/2 left-4" 
                     src="https://placehold.co/96x96" alt="Profile" />
              </div>
              <div className="pt-12 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">John Doe</h2>
                    <p className="text-gray-500">@johndoe</p>
                  </div>
                  <button className="bg-green-900 text-white px-4 py-2 rounded-lg text-sm">
                    Edit Profile
                  </button>
                </div>
                <p className="text-sm mb-6">Digital nomad, coffee enthusiast, and proud Angeleno. Always exploring the city's hidden gems! 🌴☕️</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    <span className="text-sm">Los Angeles, CA</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    <span className="text-sm">UX Designer at TechCo</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                    <a href="http://johndoe.com" className="text-sm text-green-900">johndoe.com</a>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="font-semibold">1,234</p>
                      <p className="text-sm text-gray-500">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">5,678</p>
                      <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">42</p>
                      <p className="text-sm text-gray-500">Groups</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                </div>
                <div className="absolute top-4 right-4">
                    <SignOutButton />
                </div>
        </main>);
}