'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Download, ExternalLink } from 'lucide-react';
import type { App } from '@/lib/db';

interface AppCardProps {
  app: App;
  rating?: {
    average: number;
    count: number;
  };
}

export function AppCard({ app, rating }: AppCardProps) {
  const tags = app.tags ? app.tags.split(',').map(t => t.trim()) : [];

  return (
    <Link href={`/apps/${app.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10 cursor-pointer h-full flex flex-col bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/20">
        {/* No screenshots on homepage/browse page - only on individual app page */}
        
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-start justify-between mb-3 gap-3">
            <div className="flex items-center gap-3 flex-1">
              {/* App Icon/Logo */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 bg-muted/50 flex-shrink-0">
                {app.iconUrl ? (
                  <Image
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {app.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">{app.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{app.author}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-xs font-bold rounded-full whitespace-nowrap border border-primary/20">
              v{app.version}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 leading-relaxed">
            {app.description}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={tag} 
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    index === 0 ? 'bg-primary/10 text-primary border border-primary/20' :
                    index === 1 ? 'bg-accent/10 text-accent border border-accent/20' :
                    'bg-secondary/50 text-secondary-foreground border border-secondary/20'
                  }`}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 text-secondary-foreground text-xs font-medium">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <div className="flex items-center gap-3">
              {rating && rating.count > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-foreground">
                    {rating.average.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({rating.count})
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No ratings yet</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Download className="h-4 w-4" />
                <span className="font-medium">{app.downloads}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
