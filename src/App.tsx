import React, { useState, useEffect } from 'react';
import {
  NavTab,
  FranchiseGroup,
  Outlet,
  SaleRecord,
  InventoryItem,
  StaffMember,
  MarketingCampaign,
  AuditRecord,
  AlertItem,
  UserSession,
  NotificationItem,
  NotificationRule,
} from './types';
import {
  mockFranchises,
  mockOutlets,
  mockSalesRecords,
  mockInventoryItems,
  mockStaffMembers,
  mockMarketingCampaigns,
  mockAuditRecords,
  mockAlerts,
} from './data/mockData';
import {
  mockNotificationItems,
  mockNotificationRules,
} from './data/mockNotificationsData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './components/AuthPage';
import { OutletPerformancePage } from './components/Outlets/OutletPerformancePage';

import { FranchisesPage } from './components/Pages/FranchisesPage';
import { SalesPage } from './components/Pages/SalesPage';
import { InventoryPage } from './components/Pages/InventoryPage';
import { StaffPage } from './components/Pages/StaffPage';
import { MarketingPage } from './components/Pages/MarketingPage';
import { AuditsPage } from './components/Pages/AuditsPage';
import { AlertsPage } from './components/Pages/AlertsPage';
import { IntelligencePage } from './components/Pages/IntelligencePage';
import { ExecutiveDashboardPage } from './components/Pages/ExecutiveDashboardPage';
import { NotificationsPage } from './components/Pages/NotificationsPage';

export default function App() {
  // Auth & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('franai_authenticated') === 'true';
  });
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('franai_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    setIsAuthenticated(true);
    localStorage.setItem('franai_authenticated', 'true');
    localStorage.setItem('franai_user_session', JSON.stringify(session));
  };

  const handleLogout = () => {
    setUserSession(null);
    setIsAuthenticated(false);
    localStorage.removeItem('franai_authenticated');
    localStorage.removeItem('franai_user_session');
  };

  // Navigation & UI States
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard'); // Defaults to Executive Dashboard
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>('all');
  
  // App Data States
  const [franchises] = useState<FranchiseGroup[]>(mockFranchises);
  const [outlets, setOutlets] = useState<Outlet[]>(mockOutlets);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(mockOutlets[0]);
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>(mockSalesRecords);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(mockMarketingCampaigns);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(mockAuditRecords);
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotificationItems);
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(mockNotificationRules);

  // Stationary Sales Feed State (no automated background mutations)
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(false);

  // Background ticker is kept dormant to ensure sales data remains stationary & constant
  useEffect(() => {
    if (!isLiveSimulating) return;

    // Kept for optional toggle only if explicitly turned on
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * outlets.length);
      const targetOutlet = outlets[randomIndex];
      const randomAdd = Math.floor(Math.random() * 25) + 12;

      setOutlets((prevOutlets) =>
        prevOutlets.map((o) => {
          if (o.id === targetOutlet.id) {
            return {
              ...o,
              todaySales: o.todaySales + randomAdd,
              todayOrders: o.todayOrders + 1,
              monthlyRevenue: o.monthlyRevenue + randomAdd,
            };
          }
          return o;
        })
      );

      const newSale: SaleRecord = {
        id: `s-${Date.now()}`,
        outletId: targetOutlet.id,
        outletName: targetOutlet.name,
        orderNumber: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        itemsCount: Math.floor(Math.random() * 3) + 1,
        amount: randomAdd,
        channel: ['Takeaway', 'Dine-In', 'Delivery', 'Drive-Thru'][Math.floor(Math.random() * 4)] as any,
        paymentMethod: ['Mobile Wallet', 'Credit Card', 'Cash'][Math.floor(Math.random() * 3)] as any,
        status: 'Completed',
      };

      setSalesRecords((prev) => [newSale, ...prev.slice(0, 19)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveSimulating, outlets]);

  const underperformingCount = outlets.filter((o) => o.isUnderperforming).length;
  const unreadAlertsCount = alerts.filter((a) => !a.isResolved).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* App Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedFranchiseId={selectedFranchiseId}
        setSelectedFranchiseId={setSelectedFranchiseId}
        franchises={franchises}
        outlets={outlets}
        isLiveSimulating={isLiveSimulating}
        setIsLiveSimulating={setIsLiveSimulating}
        unreadAlertsCount={unreadAlertsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onNavigateToNotifications={() => {
          setActiveTab('notifications');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userSession={userSession}
        onLogout={handleLogout}
      />

      {/* Main Body Layout with Collapsible Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          unreadAlertsCount={unreadAlertsCount}
          unreadNotificationsCount={unreadNotificationsCount}
          underperformingOutletsCount={underperformingCount}
          onLogout={handleLogout}
        />

        {/* Primary Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full transition-all duration-300">
          
          {/* Active View Router */}
          {activeTab === 'dashboard' && (
            <ExecutiveDashboardPage
              franchises={franchises}
              outlets={outlets}
              sales={salesRecords}
              inventory={inventoryItems}
              staff={staffMembers}
              campaigns={marketingCampaigns}
              audits={auditRecords}
              alerts={alerts}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onUpdateOutlets={setOutlets}
              onUpdateSales={setSalesRecords}
              onUpdateInventory={setInventoryItems}
              onUpdateStaff={setStaffMembers}
              onUpdateCampaigns={setMarketingCampaigns}
              onUpdateAudits={setAuditRecords}
              onUpdateAlerts={setAlerts}
            />
          )}

          {activeTab === 'intelligence' && (
            <IntelligencePage
              outlets={outlets}
              onNavigateToOutlets={() => setActiveTab('outlets')}
            />
          )}

          {activeTab === 'outlets' && (
            <OutletPerformancePage
              outlets={outlets}
              selectedOutlet={selectedOutlet}
              setSelectedOutlet={setSelectedOutlet}
              isLiveSimulating={isLiveSimulating}
            />
          )}

          {activeTab === 'franchises' && (
            <FranchisesPage
              franchises={franchises}
              outlets={outlets}
              onSelectOutletTab={() => setActiveTab('outlets')}
            />
          )}

          {activeTab === 'sales' && (
            <SalesPage
              sales={salesRecords}
              outlets={outlets}
              onAddNewSale={(newSale) => setSalesRecords((prev) => [newSale, ...prev])}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryPage inventory={inventoryItems} />
          )}

          {activeTab === 'staff' && (
            <StaffPage staff={staffMembers} />
          )}

          {activeTab === 'marketing' && (
            <MarketingPage campaigns={marketingCampaigns} />
          )}

          {activeTab === 'audits' && (
            <AuditsPage audits={auditRecords} />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onUpdateAlerts={(updatedAlerts) => setAlerts(updatedAlerts)}
              onSelectOutletForRecovery={(outletId) => {
                const target = outlets.find((o) => o.id === outletId);
                if (target) {
                  setSelectedOutlet(target);
                  setActiveTab('outlets');
                }
              }}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              onUpdateNotifications={setNotifications}
              rules={notificationRules}
              onUpdateRules={setNotificationRules}
              outlets={outlets}
              franchises={franchises}
              onNavigateToTab={(tab) => {
                setActiveTab(tab as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

        </main>
      </div>

    </div>
  );
}
