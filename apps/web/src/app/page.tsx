'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="w-full shadow sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">MY JUNTAR</div>
          <nav className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="/signup" className="text-gray-700 hover:text-blue-600">Signup</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-16 text-center bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Find & Book The Perfect Wedding Venue
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-xl">
          Explore top-rated venues with ease. Filter by city, budget, and amenities.
        </p>

        {/* Filter Form UI */}
        <div className="bg-white shadow rounded-lg p-6 w-full max-w-3xl grid gap-4 grid-cols-1 md:grid-cols-3">
          <input
            type="text"
            placeholder="Enter city"
            className="border border-gray-300 p-2 rounded"
          />
          <select className="border border-gray-300 p-2 rounded">
            <option>Venue Type</option>
            <option>Banquet Hall</option>
            <option>Lawn</option>
            <option>Resort</option>
          </select>
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition">
            Search Venues
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} MY JUNTAR. All rights reserved.
      </footer>
    </div>
  )
}
