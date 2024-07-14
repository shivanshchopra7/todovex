"use client";
import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import Todos from "@/components/todos/todos";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search() {
  const { searchQuery } = useParams<{ searchQuery: string }>();

  const [searchResults, setSearchResults] = useState<any>([]); // Initialize as an empty array
  const [searchInProgress, setSearchInProgress] = useState(false);

  const vectorSearch = useAction(api.search.searchTasks);

  useEffect(() => {
    const handleSearch = async () => {
      setSearchResults([]); // Reset to empty array before search

      setSearchInProgress(true);
      try {
        const results = await vectorSearch({
          query: searchQuery,
        });

        setSearchResults(results || []); // Ensure results is not null
      } finally {
        setSearchInProgress(false);
      }
    };

    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery, vectorSearch]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold md:text-2xl">
                Search Results for{" "}
                <span>
                  {`"`}
                  {decodeURI(searchQuery)}
                  {`"`}
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-1 py-4">
              <Todos
                items={searchResults?.filter(
                  (item: any) => item && !item.isCompleted
                )}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
