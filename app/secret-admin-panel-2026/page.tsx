'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/image-upload';
import { MultiImageUpload } from '@/components/multi-image-upload';
import { Trash2, Edit2 } from 'lucide-react';
import type { App } from '@/lib/firebase-service';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('manage'); // Added for tab management

  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  // ...
  // (omitting formData for brevity in target but I should be careful)
  // Let's just replace the whole relevant section

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author: '',
    version: '',
    category: '',
    tags: '',
    github_link: '',
    download_url: '',
    screenshots: [] as string[], // Changed to array for multiple screenshots
    iconUrl: '', // Added for app icon
    featured: 0,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store session token in sessionStorage (not localStorage for better security)
        sessionStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setLoginError(data.error || 'Invalid password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  // Fetch apps
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchApps() {
      try {
        const response = await fetch('/api/apps');
        const data = await response.json();
        setApps(data.apps || []);
      } catch (error) {
        console.error('Failed to fetch apps:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [isAuthenticated]);

  // Check for existing session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const url = editingId ? `/api/apps/${editingId}` : '/api/apps';
      const method = editingId ? 'PUT' : 'POST';

      // Convert screenshots array to JSON string for API
      const apiData = {
        ...formData,
        screenshots: JSON.stringify(formData.screenshots)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': '2026apps4all',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const data = await response.json();
        setFormError(data.error || 'Failed to save app');
        return;
      }

      const savedApp = await response.json();

      if (editingId) {
        setApps(apps.map(a => (a.id === editingId ? savedApp : a)));
        setEditingId(null);
      } else {
        setApps([...apps, savedApp]);
      }

      setFormSuccess(editingId ? 'App updated successfully!' : 'App added successfully!');
      resetForm();
      setActiveTab('manage'); // Go back to manage tab

      setTimeout(() => setFormSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving app:', error);
      setFormError('An error occurred while saving the app');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (app: App) => {
    setEditingId(app.id);
    
    // Parse screenshots from JSON string to array
    let screenshots: string[] = [];
    try {
      if (app.screenshots) {
        screenshots = JSON.parse(app.screenshots);
      }
    } catch (error) {
      console.error('Error parsing screenshots:', error);
      screenshots = [];
    }
    
    setFormData({
      name: app.name,
      description: app.description,
      author: app.author,
      version: app.version,
      category: app.category,
      tags: app.tags || '',
      github_link: app.github_link || '',
      download_url: app.download_url,
      screenshots: screenshots,
      iconUrl: app.iconUrl || '',
      featured: app.featured,
    });
    
    // Switch to the add/edit tab
    setActiveTab('add');
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ... (inside component)

  const handleDelete = async (id: string) => {
    // Confirmation handled by UI state now
    setFormError('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/apps/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': '2026apps4all',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFormError(errorData.error || 'Failed to delete app');
        return;
      }

      setApps(prevApps => prevApps.filter(a => a.id !== id));
      setDeleteId(null);
      setFormSuccess('App deleted successfully!');
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting app:', error);
      setFormError('An error occurred while deleting the app');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      author: '',
      version: '',
      category: '',
      tags: '',
      github_link: '',
      download_url: '',
      screenshots: [],
      iconUrl: '',
      featured: 0,
    });
    setEditingId(null);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded">
                  {loginError}
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Enter the admin password to access the dashboard
            </p>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="manage">Manage Apps</TabsTrigger>
              <TabsTrigger value="add">{editingId ? 'Edit App' : 'Add New App'}</TabsTrigger>
            </TabsList>

            {/* Manage Apps Tab */}
            <TabsContent value="manage" className="space-y-4">
              <h2 className="text-xl font-semibold">Your Apps</h2>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : apps.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No apps yet. Create your first one!</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {apps.map(app => (
                    <Card key={app.id} className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{app.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {app.author} • v{app.version} • {app.downloads} downloads
                          </p>
                        </div>
                          <div className="flex items-center gap-2">
                            {app.featured === 1 && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                Featured
                              </span>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(app)}
                              disabled={submitting}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            
                            {deleteId === app.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(app.id)}
                                  disabled={submitting}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(null)}
                                  disabled={submitting}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteId(app.id)}
                                disabled={submitting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Add/Edit App Tab */}
            <TabsContent value="add" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {editingId ? 'Edit App' : 'Add New App'}
                </h2>

                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {formError && (
                      <div className="p-3 bg-destructive/10 text-destructive rounded">
                        {formError}
                      </div>
                    )}
                    {formSuccess && (
                      <div className="p-3 bg-green-500/10 text-green-700 rounded">
                        {formSuccess}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium block mb-2">App Name *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="My Awesome App"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Author *</label>
                        <Input
                          value={formData.author}
                          onChange={(e) =>
                            setFormData({ ...formData, author: e.target.value })
                          }
                          placeholder="Your Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Version *</label>
                        <Input
                          value={formData.version}
                          onChange={(e) =>
                            setFormData({ ...formData, version: e.target.value })
                          }
                          placeholder="1.0.0"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Category *</label>
                        <Input
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          placeholder="Productivity"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">App Icon</label>
                      <ImageUpload
                        value={formData.iconUrl}
                        onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                        onRemove={() => setFormData({ ...formData, iconUrl: '' })}
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Description *</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Describe your app..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium block mb-2">Download URL *</label>
                        <Input
                          value={formData.download_url}
                          onChange={(e) =>
                            setFormData({ ...formData, download_url: e.target.value })
                          }
                          placeholder="https://github.com/user/app/releases/download/..."
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">GitHub Link</label>
                        <Input
                          value={formData.github_link}
                          onChange={(e) =>
                            setFormData({ ...formData, github_link: e.target.value })
                          }
                          placeholder="https://github.com/user/app"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Tags (comma separated)</label>
                      <Input
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                        placeholder="productivity, desktop, open-source"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Screenshots
                      </label>
                      <MultiImageUpload
                        value={formData.screenshots}
                        onChange={(urls) => setFormData({ ...formData, screenshots: urls })}
                        disabled={submitting}
                        maxImages={5}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured === 1}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            featured: checked ? 1 : 0,
                          })
                        }
                      />
                      <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                        Mark as Featured
                      </label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" disabled={submitting}>
                        {submitting
                          ? 'Saving...'
                          : editingId
                            ? 'Update App'
                            : 'Add App'}
                      </Button>
                      {editingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            resetForm();
                            setActiveTab('manage');
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/50 mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                AppHub Admin Panel
              </p>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
