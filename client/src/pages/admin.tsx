import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Word Pop! Admin Panel
            </CardTitle>
            <CardDescription>
              Admin panel has been simplified - now using official Wordle words exclusively (2,309 answers + 10,657 valid guesses).
              Custom word management is no longer available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Word Pop! now uses the official NYT Wordle word list for the most authentic experience.
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}