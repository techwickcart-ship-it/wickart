import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function LiveTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Live Tracking</h1>
        <p className="text-slate-500 mt-1">Real-time map view of all active delivery personnel.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="bg-slate-100 h-[600px] flex items-center justify-center relative w-full overflow-hidden">
             {/* Mock Map Background */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.2090&zoom=12&size=1000x800&scale=2&maptype=roadmap&sensor=false')] bg-cover bg-center"></div>
             
             <div className="z-10 flex flex-col items-center bg-white p-6 rounded-xl shadow-lg border border-slate-100 max-w-sm text-center">
                <MapPin className="w-10 h-10 text-emerald-500 mb-3" />
                <h3 className="text-lg font-bold text-slate-800">Map Integration Required</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Connect a Maps provider (like Google Maps) to see live locations of delivery agents.
                </p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
