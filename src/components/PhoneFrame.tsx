/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  // Get current time formatted for phone status bar
  const now = new Date();
  const timeString = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative mx-auto w-full max-w-[380px] h-[740px] bg-slate-900 rounded-[45px] p-3 shadow-2xl border-4 border-slate-800 ring-12 ring-slate-950 flex flex-col overflow-hidden">
      {/* Speaker and Camera Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
        <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
        <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800"></div>
      </div>

      {/* Internal Phone Screen Container */}
      <div className="w-full h-full bg-slate-50 rounded-[35px] overflow-hidden flex flex-col relative border border-slate-100">
        
        {/* Phone Status Bar */}
        <div className="h-8 bg-white border-b border-slate-100 flex items-center justify-between px-6 text-xs text-slate-700 font-medium select-none shrink-0 z-40 pt-1">
          <span>{timeString}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded-sm">3G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-700" />
            <Battery className="w-4 h-4 text-slate-700" />
          </div>
        </div>

        {/* Live Content of the Participant View */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative bg-slate-50">
          {children}
        </div>

        {/* Home Indicator bar */}
        <div className="h-4 bg-white flex items-center justify-center select-none shrink-0 z-40 border-t border-slate-100 pb-1">
          <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
