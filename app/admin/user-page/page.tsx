'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import UserTable from '@/app/admin/user-page/UserTable';
import UserFilters, { FiltersState } from '@/app/admin/user-page/UserFilters';

interface User {
  username: string;
  level: number;
  score: number;
  games_started: number;
  accuracy: number;
  engagement: number;
}

const UserPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    tags: [],
    all: 'any',
    sortBy: 'level',
    sortOrder: 'desc',
  });

  const fetchData = async () => {
    try {
      if (filters.tags.length === 0) {
        setData([])
        return;
      }
      const tagsParam = filters.tags
        .map((tag) => `tags=${encodeURIComponent(tag)}`)
        .join('&');
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/filter-users?${tagsParam}&all=${filters.all == 'all'}&sort_by=${filters.sortBy}&desc=${filters.sortOrder === 'desc'}`;
      console.log(url);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, fetchData])

  return (
    <div className="bg-white">
      <Navbar />
      <div className="mt-10">
        <Link href="/admin">
          <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all mb-10">
            Back to Admin
          </button>
        </Link>
        
      </div>
      <div className="h-screen bg-white text-black">
        <h1 className="text-3xl font-bold text-center py-8">User Page</h1>

        <UserFilters filters={filters} setFilters={setFilters} />
        <UserTable data={data} />
      </div>
    </div>
  );
};

export default UserPage;
