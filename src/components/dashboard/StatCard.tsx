import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
    isPositive: boolean;
  };
  highlightColor?: 'blue' | 'teal' | 'amber' | 'slate';
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  highlightColor = 'blue'
}: StatCardProps) {
  
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</h2>
              {trend && (
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  trend.isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          <div className={cn("p-3 rounded-2xl", colors[highlightColor])}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
