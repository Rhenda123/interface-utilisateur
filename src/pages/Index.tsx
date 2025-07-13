import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // If not authenticated, redirect to auth page
  useEffect(() => {
    if (!session && !user) {
      navigate('/auth');
    }
  }, [session, user, navigate]);

  // Don't render anything if not authenticated
  if (!session || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skoolife-light via-white to-skoolife-light">
      {/* Header with sign out option */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-skoolife-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-skoolife-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-gray-800">S</span>
          </div>
          <span className="font-semibold text-gray-800">Skoolife</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-600 hover:text-skoolife-primary transition-colors"
        >
          Déconnexion
        </button>
      </div>

      {/* Main content */}
      <main className="pb-20">
        <section className="section-padding">
          <div className="container">
            <Card className="card-responsive">
              <CardHeader>
                <CardTitle>Welcome to Skoolife</CardTitle>
                <CardDescription>
                  Explore the features and start managing your tasks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This is a basic index page. You can add more content here.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm border-t border-skoolife-primary/10 p-4">
        <div className="container flex justify-around">
          <Button variant="ghost">Finances</Button>
          <Button variant="ghost">Tâches</Button>
          <Button variant="ghost">Documents</Button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
