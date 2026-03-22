'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { AppCard } from '@/components/app-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Download } from 'lucide-react';
import type { App } from '@/lib/db';

interface AppWithRating extends App {
  ratingStats?: {
    average: number;
    count: number;
  };
}

export default function Home() {
  const [featuredApps, setFeaturedApps] = useState<AppWithRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedApps() {
      try {
        const response = await fetch('/api/apps');
        const data = await response.json();
        
        // Get featured apps (or just first 6 if none are marked featured)
        let apps = data.apps || [];
        const featured = apps.filter((a: App) => a.featured === 1).slice(0, 6);
        
        if (featured.length === 0) {
          apps = apps.slice(0, 6);
        } else {
          apps = featured;
        }

        // Fetch ratings for each app
        const appsWithRatings = await Promise.all(
          apps.map(async (app: App) => {
            const ratingRes = await fetch(`/api/apps/${app.id}/ratings`);
            const ratingData = await ratingRes.json();
            return {
              ...app,
              ratingStats: ratingData.ratingStats,
            };
          })
        );

        setFeaturedApps(appsWithRatings);
      } catch (error) {
        console.error('Failed to fetch featured apps:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedApps();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Discover Amazing Apps
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Your App
              </span>
              <br />
              <span className="text-foreground">Marketplace</span>
            </h1>
            <p className="text-balance text-xl text-muted-foreground sm:text-2xl max-w-3xl mx-auto leading-relaxed">
              Browse, download, and review applications created by talented developers. Find the perfect app for your needs.
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Link href="/apps">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all">
                  Browse Apps
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Apps Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 text-sm font-medium text-accent mb-4">
              <Sparkles className="h-4 w-4" />
              Featured Collection
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Trending Apps
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the most popular applications and community favorites
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gradient-to-br from-muted to-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : featuredApps.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">No apps available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuredApps.map((app) => (
                <AppCard key={app.id} app={app} rating={app.ratingStats} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary rounded-2xl p-12 sm:p-16 text-center text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Ready to explore more?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Check out our complete collection of applications and find something new that fits your needs perfectly.
              </p>
              <Link href="/apps">
                <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm">
                  View All Apps
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <Sparkles className="h-16 w-16" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Sparkles className="h-12 w-12" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-gradient-to-r from-background to-muted/30 mt-20">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Download className="h-6 w-6 text-primary" />
                  <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AppHub
                </span>
                <span className="text-muted-foreground">- Your app marketplace</span>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <Link href="/apps" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Apps
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
