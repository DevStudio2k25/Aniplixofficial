'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { AppCard } from '@/components/app-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { App, Rating } from '@/lib/firebase-service';

interface AppWithRating extends App {
  ratingStats?: {
    average: number;
    count: number;
  };
}

export default function AppsPage() {
  const [apps, setApps] = useState<AppWithRating[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppWithRating[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        // Fetch all apps
        const response = await fetch('/api/apps');
        const data = await response.json();
        
        // Fetch categories
        const catResponse = await fetch('/api/apps?categories=true');
        const catData = await catResponse.json();
        setCategories(catData.categories || []);

        // Fetch ratings for each app
        const appsWithRatings = await Promise.all(
          (data.apps || []).map(async (app: App) => {
            const ratingRes = await fetch(`/api/apps/${app.id}/ratings`);
            const ratingData = await ratingRes.json();
            return {
              ...app,
              ratingStats: ratingData.ratingStats,
            };
          })
        );

        setApps(appsWithRatings);
        setFilteredApps(appsWithRatings);
      } catch (error) {
        console.error('Failed to fetch apps:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  // Filter apps based on search and category
  useEffect(() => {
    let filtered = apps;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.author.toLowerCase().includes(query) ||
        app.tags.toLowerCase().includes(query)
      );
    }

    setFilteredApps(filtered);
  }, [searchQuery, selectedCategory, apps]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Apps</h1>
            <p className="text-muted-foreground">Explore our collection of applications</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search apps by name, author, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || selectedCategory !== 'all') && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Apps Grid */}
          {loading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {apps.length === 0
                  ? 'No apps available yet. Check back soon!'
                  : 'No apps match your search criteria. Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredApps.length} of {apps.length} apps
              </div>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} rating={app.ratingStats} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/50 mt-16">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                AppHub - Your app marketplace
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
