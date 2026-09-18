import React, { useState } from 'react';
import { Menu, Store, TrendingUp, Zap, Building2, LogOut, User, UserPlus, Bell } from 'lucide-react';
import { FranchiseGroup, Outlet, UserSession } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectedFranchiseId: string;
  setSelectedFranchiseId: (id: string) => void;
  franchises: FranchiseGroup[];
  outlets: Outlet[];
  isLiveSimulating: boolean;
  setIsLiveSimulating: (sim: boolean | ((prev: boolean) => boolean)) => void;
  unreadAlertsCount: number;
  unreadNotificationsCount?: number;
  onNavigateToNotifications?: () => void;
  userSession?: UserSession | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  selectedFranchiseId,
  setSelectedFranchiseId,
  franchises,
  outlets,
  isLiveSimulating,
  setIsLiveSimulating,
  unreadAlertsCount,
  unreadNotificationsCount = 0,
  onNavigateToNotifications,
  userSession,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const filteredOutlets = selectedFranchiseId === 'all'
    ? outlets
    : outlets.filter(o => o.franchiseId === selectedFranchiseId);

  const totalMonthlyRev = filteredOutlets.reduce((acc, curr) => acc + curr.monthlyRevenue, 0);
  const avgHealth = Math.round(
    filteredOutlets.reduce((acc, curr) => acc + curr.healthScore, 0) / (filteredOutlets.length || 1)
  );

  return (
    <header id="main-header" className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between transition-all duration-200">
      
      {/* Left Section: Menu Toggle + FranAI Logo */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle-button"
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all focus:outline-none"
          title={sidebarOpen ? 'Collapse Navigation' : 'Expand Navigation'}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-xs">
            <Zap className="w-5 h-5 fill-emerald-400 text-emerald-400" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Fran<span className="text-emerald-600">AI</span>
          </span>
        </div>
      </div>

      {/* Center Section: Franchise Selector & Quick Stats */}
      <div className="hidden lg:flex items-center gap-5">
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <select
            id="franchise-selector"
            value={selectedFranchiseId}
            onChange={(e) => setSelectedFranchiseId(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer pr-1 font-semibold text-slate-800"
          >
            <option value="all">All Brands ({franchises.length})</option>
            {franchises.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>₹{((totalMonthlyRev || 0) / 1000).toFixed(1)}k / mo</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>{filteredOutlets.length} Stores</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-xl font-bold">
            <span>Score {avgHealth}/100</span>
          </div>
        </div>
      </div>

      {/* Right Section: Live Feed, Registration Button & User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Quick Notification Bell */}
        <button
          id="header-notifications-btn"
          onClick={onNavigateToNotifications}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative cursor-pointer"
          title="Open Notifications & Broadcast Hub"
        >
          <Bell className="w-4 h-4 text-slate-700" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        <button
          id="registration-page-btn"
          onClick={onLogout}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 border border-slate-800"
          title="Back to Registration & Sign Up Page"
        >
          <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Registration Page</span>
        </button>

        <button
          id="live-simulation-toggle"
          onClick={() => setIsLiveSimulating(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            isLiveSimulating
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLiveSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span className="hidden sm:inline">
            {isLiveSimulating ? 'Live Feed' : 'Feed Paused'}
          </span>
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-200 transition-all focus:outline-none shadow-xs"
            title="User Profile & Account"
          >
            {userSession?.avatarInitials || 'JD'}
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-slate-800">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-bold text-sm text-slate-900 leading-tight">
                  {userSession?.name || 'John Davis'}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {userSession?.email || 'admin@dominos-mcd.com'}
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold">
                  {userSession?.role || 'Franchise Owner'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out & Switch User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};
