'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScreenshotGallery } from '@/components/screenshot-gallery';
import { Star, Download, Github, ArrowLeft } from 'lucide-react';
import type { App, Rating } from '@/lib/firebase-service';

export default function AppDetailPage() {
  const params = useParams();
  const appId = params.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchAppDetails() {
      try {
        const response = await fetch(`/api/apps/${appId}`);
        const data = await response.json();

        if (!response.ok) {
          setError('App not found');
          setLoading(false);
          return;
        }

        setApp(data.app);
        setRatings(data.ratings);
        setRatingStats(data.ratingStats);
      } catch (err) {
        console.error('Failed to fetch app details:', err);
        setError('Failed to load app details');
      } finally {
        setLoading(false);
      }
    }

    fetchAppDetails();
  }, [appId]);

  const handleDownload = async () => {
    try {
      // The download endpoint will redirect to the actual download URL
      window.location.href = `/api/apps/${appId}/download`;
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/apps/${appId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newRating,
          review: newReview || undefined,
        }),
      });

      if (!response.ok) {
        setError('Failed to submit rating');
        return;
      }

      const newRatingData = await response.json();
      setRatings([newRatingData, ...ratings]);
      setNewRating(5);
      setNewReview('');
      setSuccess('Rating submitted successfully!');

      // Refresh rating stats
      const ratingRes = await fetch(`/api/apps/${appId}/ratings`);
      const ratingData = await ratingRes.json();
      setRatingStats(ratingData.ratingStats);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      setError('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="h-12 bg-muted rounded animate-pulse" />
              <div className="h-96 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!app) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <Link href="/apps">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Apps
              </Button>
            </Link>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">{error || 'App not found'}</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  const screenshots = app.screenshots ? JSON.parse(app.screenshots) : [];
  const tags = app.tags ? app.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/apps">
            <Button variant="ghost" className="gap-2 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Apps
            </Button>
          </Link>

          {/* App Header */}
          <div className="mb-8">
            <div className="flex items-start gap-6 mb-6">
              {/* App Icon */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/50 bg-muted/50 flex-shrink-0">
                {app.iconUrl ? (
                  <Image
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {app.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-bold mb-2">{app.name}</h1>
                <div className="flex flex-wrap gap-4 items-center text-muted-foreground mb-4">
                  <span>by {app.author}</span>
                  <span>v{app.version}</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {app.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 mb-6">
              {ratingStats.count > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(ratingStats.average)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">
                      {ratingStats.average.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({ratingStats.count} reviews)
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {app.downloads} downloads
                  </span>
                </>
              ) : (
                <p className="text-muted-foreground">No ratings yet</p>
              )}
            </div>
          </div>

          {/* Description */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{app.description}</p>

            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Screenshots */}
          <ScreenshotGallery screenshots={screenshots} appName={app.name} />

          {/* Download Section */}
          <Card className="p-6 mb-8 bg-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">Ready to use this app?</h2>
                <p className="text-sm text-muted-foreground">Download and start using it right away</p>
              </div>
              <div className="flex items-center gap-3">
                {app.github_link && (
                  <a href={app.github_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Button>
                  </a>
                )}
                <Button onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          {/* Reviews Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

              {/* Add Review Form */}
              <Card className="p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <form onSubmit={handleSubmitRating} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-500/10 text-green-700 rounded">
                      {success}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium block mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 cursor-pointer transition-colors ${
                              star <= newRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="review" className="text-sm font-medium block mb-2">
                      Review (optional)
                    </label>
                    <Textarea
                      id="review"
                      placeholder="Share your thoughts about this app..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </Card>

              {/* Reviews List */}
              {ratings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reviews yet. Be the first to review this app!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ratings.map(rating => (
                    <Card key={rating.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.review && (
                        <p className="text-sm text-muted-foreground">{rating.review}</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/50 mt-16">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                AppHub - Your app marketplace
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
