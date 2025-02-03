'use client';

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import AdminStats from "./AdminStats";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Admin() {
  const [feedbackStatusData, setFeedbackStatusData] = useState({ complete: 0, incomplete: 0 });
  const [totalImagesData, setTotalImagesData] = useState({ realImages: 0, aiImages: 0, realImagesPercent: 0, aiImagesPercent: 0 });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackStatusResponse = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/getFeedbackResolutionStatus');
        const feedbackStatus = await feedbackStatusResponse.json();

        const complete = feedbackStatus[0].resolvedCount;
        const incomplete = feedbackStatus[0].unresolvedCount;
        setFeedbackStatusData({ complete, incomplete });

        const realImagesResponse = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/getTotalRealImages');
        const aiImagesResponse = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/getTotalAIImages');
        
        let realImages = await realImagesResponse.json();
        let aiImages = await aiImagesResponse.json();
        realImages = realImages[0];
        aiImages = aiImages[0];


        if (realImages && typeof realImages.totalReal === 'number' && typeof realImages.percentageDetected === 'number') {
          setTotalImagesData(prev => ({ ...prev, realImages: realImages.totalReal, realImagesPercent: realImages.percentageDetected * 100 }));
        }

        if (aiImages && typeof aiImages.totalAI === 'number' && typeof aiImages.percentageDetected === 'number') {
          setTotalImagesData(prev => ({ ...prev, aiImages: aiImages.totalAI, aiImagesPercent: aiImages.percentageDetected * 100 }));
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const chartData = {
    labels: ["Complete", "Incomplete"],
    datasets: [
      {
        label: "Feedback Status",
        data: [feedbackStatusData.complete, feedbackStatusData.incomplete],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event: any, elements: string | any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const filter = index === 0 ? "complete" : "incomplete";
        window.location.href = `/all-feedback?filter=${filter}`;
      }
    },
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
      <Navbar />

      <section className="flex flex-wrap gap-8 p-8 bg-white justify-center">
        <div className="w-full md:w-[48%]">
          <AdminStats title="Total Engagement" graphType="engagement" />
        </div>
        <div className="w-full md:w-[48%]">
          <AdminStats title="User Accuracy" graphType="accuracy" />
        </div>
      </section>

      <section className="p-8 bg-white">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-8 w-full lg:w-3/4">
            <div className="bg-white p-6 shadow-md rounded-2xl text-black">
              <h2 className="text-xl font-bold mb-4">Real Images</h2>
              <p>Total images: {totalImagesData.realImages}</p>
              <p>Percentage detected: {totalImagesData.realImagesPercent.toFixed(2)}%</p>
              <div className="flex flex-wrap gap-4 mt-6">
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  View Feedback
                </button>
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Upload New Images
                </button>
              </div>
            </div>

            <div className="bg-white p-6 shadow-md rounded-2xl text-black">
              <h2 className="text-xl font-bold mb-4">AI Images</h2>
              <p>Total images: {totalImagesData.aiImages}</p>
              <p>Percentage detected: {totalImagesData.aiImagesPercent.toFixed(2)}%</p>
              <div className="flex flex-wrap gap-4 mt-6">
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  View Feedback
                </button>
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Upload New Images
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-2xl w-full lg:w-1/4 text-black lg:ml-auto text-center">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Sitemap</h2>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="p-8 bg-gray-50 text-black">
        <div className="flex justify-evenly w-full items-center gap-4">
          <Link
            href="/admin/individual-feedback"
            className="w-full sm:w-auto px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105 text-center"
          >
            View Individual Feedback
          </Link>
          <Link
            href="/admin/heatmap-feedback"
            className="w-full sm:w-auto px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105 text-center"
          >
            View Heatmap Feedback
          </Link>
        </div>
      </section>

      <section className="p-8 bg-gray-50 text-black text-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Feedback Navigation</h2>

        <div className="flex justify-between items-center gap-8">
          <div className="w-1/2 h-64 flex justify-center">
            <Pie data={chartData} options={chartOptions} />
          </div>

          <div className="w-1/2 flex flex-col gap-4 items-center">
            <Link
              href="/all-feedback?filter=all"
              className="px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              View All Feedback
            </Link>
            <Link
              href="/all-feedback?filter=complete"
              className="px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              View Complete Feedback
            </Link>
            <Link
              href="/all-feedback?filter=incomplete"
              className="px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              View Incomplete Feedback
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
