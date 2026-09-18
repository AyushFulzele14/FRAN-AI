import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Store,
  IndianRupee,
  Package,
  Users,
  Megaphone,
  ClipboardCheck,
  BellRing,
  ChevronRight,
  Sparkles,
  UserPlus,
  BrainCircuit,
  Bell,
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  unreadAlertsCount: number;
  underperformingOutletsCount: number;
  unreadNotificationsCount?: number;
  onLogout?: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  description: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  underperformingOutletsCount,
  unreadNotificationsCount = 2,
  onLogout,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      description: 'All-in-One Multi-Module Control',
    },
    {
      id: 'intelligence',
      label: 'Franchise Intelligence',
      icon: BrainCircuit,
      description: 'AI Diagnostics & Problem Solvers',
    },
    {
      id: 'franchises',
      label: 'Franchises',
      icon: Building2,
      description: 'Master franchise overview',
    },
    {
      id: 'outlets',
      label: 'Outlets',
      icon: Store,
      badge: underperformingOutletsCount > 0 ? underperformingOutletsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Locations, sales & AI health',
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: IndianRupee,
      description: 'Revenue & order channels',
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      description: 'Stock & supply reorders',
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: Users,
      description: 'Shifts & productivity',
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Megaphone,
      description: 'Campaigns & promotions',
    },
    {
      id: 'audits',
      label: 'Audits',
      icon: ClipboardCheck,
      description: 'Quality compliance & grades',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: BellRing,
      description: 'Real-time warnings',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-800 font-bold',
      description: 'Email, SMS & Mobile dispatch',
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`fixed lg:sticky top-16 left-0 z-20 h-[calc(100vh-64px)] bg-white border-r border-slate-200 shadow-xs transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isOpen ? 'w-64' : 'w-0 lg:w-20'
      }`}
    >
      {/* Navigation Links */}
      <div className="p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className={`px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${!isOpen && 'lg:hidden'}`}>
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className={`min-w-0 ${!isOpen && 'lg:hidden'}`}>
                  <p className="text-sm truncate leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-emerald-100 text-emerald-800'
                  } ${!isOpen && 'lg:hidden'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Dedicated Navigation Link to Registration / Auth Page */}
        <div className="pt-2 mt-2 border-t border-slate-100">
          <button
            id="nav-link-registration"
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200/60"
            title="Registration & Login Page"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-slate-900 text-white shadow-2xs">
                <UserPlus className="w-4 h-4 text-emerald-400" />
              </div>

              <div className={`min-w-0 ${!isOpen && 'lg:hidden'}`}>
                <p className="text-sm font-bold truncate leading-tight text-slate-900">Registration Page</p>
                <p className="text-[10px] text-slate-500 truncate">Sign up or switch account</p>
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 text-slate-400 ${!isOpen && 'lg:hidden'}`} />
          </button>
        </div>
      </div>

      {/* Sleek Light AI Insights Card */}
      <div className={`p-3 ${!isOpen && 'lg:hidden'}`}>
        <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-3.5 text-slate-900 shadow-xs">
          <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Operations Alert</span>
          </div>
          <div className="text-xs text-slate-800 leading-snug font-semibold">
            3 outlets require immediate restock of high-margin inventory items.
          </div>
        </div>
      </div>
    </aside>
  );
};
