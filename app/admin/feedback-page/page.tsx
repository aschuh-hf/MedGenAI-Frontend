'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { Feedback } from '@/app/types/Feedback';
import FeedbackTable from '@/app/admin/feedback-page/FeedbackTable';
import Pagination from '@/app/admin/Pagination';
import FeedbackFilters from '@/app/admin/feedback-page/FeedbackFilters';

const FeedbackPage = () => {
  const filterParam = useSearchParams()?.get('filter');

  const [data, setData] = useState<Feedback[]>([]);
  const [filters, setFilters] = useState({
    type: filterParam === 'real' ? 'real' : filterParam === 'ai' ? 'ai' : 'all',
    resolved: filterParam === 'complete' ? true : filterParam === 'false' ? false : null,
    sortBy: 'last_feedback_time',
    sortOrder: 'asc',
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 1. Helper function to fetch the actual image and create a local blob URL
  const fetchImage = async (imagePath: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/view/${encodeURIComponent(imagePath)}`
      );
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  // 2. Main data fetch: once we get the raw data, convert image paths to local blob URLs
  const fetchData = async (page = 1) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getFeedbacks?image_type=${filters.type}&resolved=${filters.resolved}&sort_by=${filters.sortBy}&sort_order=${filters.sortOrder}&page=${page}&limit=20`;
      const response = await fetch(
        url
      );
      console.log(url);
      const result = await response.json();
      console.log("result: ", result);
      const itemsWithUrl = await Promise.all(
        result.map(async (item: Feedback) => {
          const localUrl = await fetchImage(item.image_path);
          console.log(item.image_id);
          return {
            ...item,
            image_path: localUrl, // store the blob URL here
          };
        })
      );

      setData(itemsWithUrl);

      // Optionally, you can fetch the total count for pagination:
      await fetchFeedbackCount();
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // 3. Fetch the total feedback count (for pagination)
  const fetchFeedbackCount = async (): Promise<void> => {
    try {
      const countRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getFeedbackCount?image_type=${filters.type}&resolved=${filters.resolved}`
      );
      const { total_count } = await countRes.json();
      setTotalPages(Math.ceil(total_count / 20));
    } catch (error) {
      console.error('Error fetching feedback count:', error);
    }
  };

  // Re-fetch data whenever filters or current page change
  useEffect(() => {
    console.log("filters:", filters);
    fetchData(currentPage);
  }, [filters, currentPage]);

  return (
    <div className="bg-white">
      <Navbar />
      <div className="mt-10">
        <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all">
          Back to Admin
        </button>
      </div>
      <div className="h-screen bg-white text-black overflow-y-auto">
        <h1 className="text-3xl font-bold text-center py-8">Feedback Page</h1>

        <FeedbackFilters filters={filters} setFilters={setFilters} />
        <FeedbackTable data={data} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
