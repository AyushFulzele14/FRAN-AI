export interface UserSession {
  name: string;
  email: string;
  role: string;
  franchiseBrand?: string;
  avatarInitials: string;
}

export type NavTab = 
  | 'dashboard'
  | 'franchises'
  | 'outlets'
  | 'sales'
  | 'inventory'
  | 'staff'
  | 'marketing'
  | 'audits'
  | 'alerts'
  | 'notifications'
  | 'intelligence';

export interface IntelligenceProblemCase {
  id: string;
  category: 'Operations' | 'Inventory & Cost' | 'Staffing & Labor' | 'Customer Experience' | 'Pricing & Margin' | 'Expansion';
  title: string;
  description: string;
  affectedOutlets: string[];
  severity: 'Critical' | 'High' | 'Moderate';
  estimatedLossRupees: number;
  rootCauseSummary: string;
  aiSuggestedFix: string;
  roiProjection: string;
  actionButtonLabel: string;
  status: 'Detected' | 'AI In-Progress' | 'Resolved';
}

export interface AIRootCauseDiagnosis {
  problemId?: string;
  problemTitle: string;
  severity: 'Critical' | 'High' | 'Moderate';
  analyzedOutletName: string;
  confidenceScore: number;
  primaryRootCause: string;
  contributingFactors: string[];
  immediateRemedy24H: string[];
  systemicPlan30D: {
    phase: string;
    action: string;
    expectedMetricImpact: string;
  }[];
  projectedFinancialRecoveryRupees: number;
  automatedPolicyActions: {
    id: string;
    label: string;
    description: string;
    targetModule: string;
    executed?: boolean;
  }[];
}

export interface PredictiveRiskForecast {
  outletId: string;
  outletName: string;
  city: string;
  stockoutRisk: number; // 0 - 100
  laborFatigueIndex: number; // 0 - 100
  csatDropProbability: number; // 0 - 100
  marginErosionRisk: number; // 0 - 100
  overallRiskLevel: 'Low' | 'Medium' | 'Elevated' | 'Critical';
  topPreventiveAction: string;
}

export interface AutonomousAIAgent {
  id: string;
  name: string;
  domain: string;
  status: 'Active' | 'Optimizing' | 'Standby';
  description: string;
  decisionsLast24H: number;
  monthlyRupeesSaved: number;
  accuracyRate: string;
  lastAction: string;
}

export interface FranchiseGroup {
  id: string;
  name: string;
  brand: string;
  category: string;
  totalOutlets: number;
  activeOutlets: number;
  totalMonthlyRevenue: number;
  growthRate: number;
  logoUrl?: string;
}

export interface SalesChannelBreakdown {
  dineIn: number;
  takeaway: number;
  delivery: number;
  driveThru: number;
}

export interface RevenueTrendPoint {
  date: string;
  actualRevenue: number;
  targetRevenue: number;
  orderCount: number;
  avgTicket: number;
}

export interface Outlet {
  id: string;
  code: string;
  name: string;
  franchiseId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  coordinates: {
    lat: number;
    lng: number;
  };
  manager: string;
  contactEmail: string;
  contactPhone: string;
  openingHours: string;
  status: 'Open' | 'Busy' | 'Maintenance' | 'Closed';
  
  // Sales Performance Metrics
  todaySales: number;
  todayOrders: number;
  monthlyRevenue: number;
  monthlyTarget: number;
  revenueGrowth: number; // percentage
  avgTicketSize: number;
  fulfillmentTimeMin: number;
  salesByChannel: SalesChannelBreakdown;
  
  // Health & Audit Metrics
  healthScore: number; // 0-100
  healthGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  auditScore: number; // 0-100
  lastAuditDate: string;
  isUnderperforming: boolean;
  underperformingReason?: string;
  
  // Store Resources
  staffCount: number;
  activeStaffOnShift: number;
  inventoryStockStatus: 'Optimal' | 'Low Stock' | 'Critical Shortage' | 'Overstocked';
  customerRating: number; // 1-5
  totalReviews: number;
  
  // Recent Trend
  weeklyRevenueData: RevenueTrendPoint[];
}

export interface SaleRecord {
  id: string;
  outletId: string;
  outletName: string;
  orderNumber: string;
  timestamp: string;
  itemsCount: number;
  amount: number;
  channel: 'Dine-In' | 'Takeaway' | 'Delivery' | 'Drive-Thru';
  paymentMethod: 'Credit Card' | 'Mobile Wallet' | 'Cash' | 'UPI / QR Code';
  status: 'Completed' | 'Processing' | 'Refunded' | 'Cancelled';
  customerName?: string;
  items?: { name: string; qty: number; price: number }[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  tableOrCarNo?: string;
  prepTimeMinutes?: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Raw Ingredients' | 'Packaging' | 'Beverages' | 'Equipment';
  totalStock: number;
  unit: string;
  reorderPoint: number;
  unitPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Reorder Needed';
  affectedOutletsCount: number;
  supplierName?: string;
  leadTimeDays?: number;
  lastRestocked?: string;
  expiryDate?: string;
  batchNo?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Store Manager' | 'Shift Lead' | 'Kitchen Chief' | 'Barista/Server' | 'Cashier';
  outletId: string;
  outletName: string;
  performanceScore: number; // 1-100
  shiftsCompletedThisMonth: number;
  status: 'Present' | 'On Shift' | 'Absent' | 'On Leave';
  loginTime: string;
  logoutTime: string;
  totalPresents: number;
  totalAbsents: number;
  dailySales: number; // ₹ sales handled by staff on the day
  customerRating: number; // 1.0 to 5.0
  recentFeedback?: string;
  date?: string;
  avatar?: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  code: string;
  discountType: 'Percentage' | 'BOGO' | 'Fixed Cash';
  targetRegions: string[];
  startDate: string;
  endDate: string;
  budget: number;
  attributedRevenue: number;
  roi: number;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Paused';
  
  // Performance Monitoring
  impressions?: number;
  clicks?: number;
  ctr?: number; // %
  cpa?: number; // Cost Per Acquisition ₹
  
  // Promotion Effectiveness
  totalIssued?: number;
  redemptions?: number;
  redemptionRate?: number; // %
  aovWithPromo?: number; // ₹
  aovWithoutPromo?: number; // ₹
  basketUpliftPercent?: number; // %
  topPromotedItem?: string;
  
  // Customer Engagement
  channelBreakdown?: {
    appPush: number; // %
    socialAds: number; // %
    inStoreQR: number; // %
    email: number; // %
  };
  customerTypeBreakdown?: {
    newCustomers: number; // %
    returningCustomers: number; // %
  };
  csatScore?: number; // 1-5 rating
  
  // AI Recommendations
  recommendations?: {
    id: string;
    type: 'High Impact' | 'Budget Optimization' | 'Engagement' | 'Promo Tuning';
    title: string;
    description: string;
    expectedRevenueImpact: number;
    expectedRoiGain: number;
  }[];
}

export interface AuditRecord {
  id: string;
  outletId: string;
  outletName: string;
  auditorName: string;
  auditDate: string;
  overallScore: number;
  hygieneScore: number;
  serviceSpeedScore: number;
  complianceScore: number;
  status: 'Passed' | 'Action Required' | 'Failed';
  criticalNotes: string[];
  inspectionCategory?: 'Food Safety & Hygiene' | 'Equipment Safety' | 'Brand Compliance' | 'Speed & Operations';
  nextAuditDate?: string;
  certificateId?: string;
  correctiveActions?: {
    id: string;
    issue: string;
    assignedTo: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Verified' | 'Closed';
    dueDate: string;
  }[];
}

export interface PolicyViolation {
  id: string;
  outletId: string;
  outletName: string;
  category: 'Late Opening' | 'Fake Attendance' | 'Unauthorized Discount' | 'Expired Product' | 'Missing GST Invoice' | 'Ignored Complaint';
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  detectedAt: string;
  status: 'Active' | 'Under Review' | 'Resolved';
}

export interface OperationalCheck {
  id: string;
  outletId: string;
  outletName: string;
  openingClosingTime: string;
  openingStatus: 'On Time' | 'Late Opening (25m)' | 'Early Closing';
  attendanceRate: number; // e.g. 95%
  staffOnShift: string; // e.g. "8 / 8 Staff Present"
  inventorySynced: boolean;
  cashRegisterClosing: 'Balanced' | 'Discrepancy ₹450' | 'Discrepancy ₹1,200';
  cleaningLogStatus: 'Completed' | 'Pending Evening Check';
  maintenanceStatus: 'All Equipment Operational' | 'Fryer Servicing Due';
  avgComplaintResponseMins: number;
}

export interface CorrectiveTask {
  id: string;
  title: string;
  outletName: string;
  assignedTo: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Verified' | 'Closed';
  dueDate: string;
  createdAt: string;
  category: string;
  notes?: string;
}

export interface AIVisionInspection {
  id: string;
  title: string;
  outletName: string;
  imageUrl: string;
  brandingScore: number;
  uniformScore: number;
  cleanlinessScore: number;
  layoutScore: number;
  detectedIssues: string[];
  analyzedAt: string;
}

export interface AlertItem {
  id: string;
  type: 'Critical Revenue Drop' | 'Low Health Score' | 'Inventory Outage' | 'Audit Failure' | 'Staff Shortage' | 'Equipment Malfunction' | 'Customer Complaint Spike' | string;
  outletId: string;
  outletName: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low' | 'critical';
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  category?: 'Revenue & Sales' | 'Inventory & Supply' | 'Health & Hygiene' | 'Equipment & IoT' | 'Staff & Operations';
  recommendedAction?: string;
  status?: 'Active' | 'In Progress' | 'Acknowledged' | 'Resolved';
  actionTaken?: string;
  assignedTo?: string;
  impactScore?: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'Greater Than' | 'Less Than' | 'Drops By %' | 'Exceeds Threshold';
  thresholdValue: string;
  severity: 'high' | 'medium' | 'low' | 'critical';
  category: string;
  isEnabled: boolean;
  notifyChannels: ('In-App' | 'Email' | 'SMS' | 'Slack')[];
}

export interface AIHealthAnalysis {
  healthScore: number;
  grade: string;
  summary: string;
  keyStrengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AIRecoveryPlan {
  outletName: string;
  targetTimelineWeeks: number;
  rootCause: string;
  milestones: { week: string; action: string }[];
  expectedImpact: string;
}

export interface AIComparisonResult {
  winner: string;
  keyDifferentiator: string;
  comparativeInsights: string[];
  crossStoreBestPractices: string[];
}

// ----------------------------------------------------
// NOTIFICATIONS MODULE TYPES
// ----------------------------------------------------

export type NotificationPriority = 'P1 - Critical' | 'P2 - High' | 'P3 - Medium' | 'P4 - Low';

export type NotificationChannel = 'email' | 'sms' | 'mobile';

export type NotificationStatus = 'Delivered' | 'Sent' | 'Pending' | 'Failed' | 'Read';

export type NotificationRecipientGroup = 
  | 'All Store Managers'
  | 'Franchise Owners'
  | 'Regional Operations Leads'
  | 'Kitchen & Shift Leads'
  | 'Emergency Response Team'
  | 'Custom Recipients';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  recipientType: NotificationRecipientGroup;
  recipientCount: number;
  recipientSummary: string;
  outletId?: string;
  outletName?: string;
  franchiseBrand?: string;
  timestamp: string;
  status: NotificationStatus;
  read: boolean;
  source: 'Automated Rule' | 'Manual Dispatch' | 'System Trigger' | 'AI Diagnostic';
  ruleId?: string;
  category: 'Revenue & Sales' | 'Inventory & Supply' | 'Food Safety & QA' | 'Staffing & Shifts' | 'Customer & Operations' | 'Emergency & IoT';
  
  // Specific Channel Deliverables
  emailDetails?: {
    subject: string;
    bodyHtml?: string;
    toAddresses: string[];
    openRate?: number;
    clickRate?: number;
    deliveredCount?: number;
  };
  
  smsDetails?: {
    senderId: string; // e.g. "VK-FRANAI"
    text: string;
    charCount: number;
    smsSegments: number;
    phoneNumbers: string[];
    deliveredCount?: number;
    operatorAck?: string;
  };
  
  mobileDetails?: {
    pushTitle: string;
    pushBody: string;
    deepLinkUrl: string;
    sound: 'Urgent Siren' | 'Store Chime' | 'Default Alert' | 'Vibrate Only';
    badgeIncrement: number;
    deliveredDevices?: number;
    actionButtons?: { id: string; label: string; action: string }[];
  };
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  category: 'Revenue & Sales' | 'Inventory & Supply' | 'Food Safety & QA' | 'Staffing & Shifts' | 'Customer & Operations' | 'Emergency & IoT';
  triggerCondition: string;
  threshold: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  targetAudience: NotificationRecipientGroup;
  autoEscalate: boolean;
  escalationAfterMinutes?: number;
  isEnabled: boolean;
  lastTriggered?: string;
  triggerCount: number;
  customEmailTemplate?: string;
  customSmsTemplate?: string;
  customPushTemplate?: string;
}

export interface NotificationDeliveryLog {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  recipient: string;
  recipientRole: string;
  status: 'Delivered' | 'Opened' | 'Failed' | 'Pending';
  timestamp: string;
  latencyMs: number;
  errorMessage?: string;
}
