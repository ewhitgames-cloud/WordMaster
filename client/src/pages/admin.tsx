import React from 'react';
import { WordAdminPanel } from '@/components/word-admin-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

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
              Manage custom words and review player suggestions for the game dictionary.
            </CardDescription>
          </CardHeader>
        </Card>

        <WordAdminPanel />
      </div>
    </div>
  );
}