import React, { useState } from 'react';
import {
  Cpu,
  Server,
  Network,
  Database,
  Lock,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Radio,
  Eye,
  Camera,
  FileCheck,
  RefreshCw,
  HardDrive,
  Sliders,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuditSystemArchitecture: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(1);
  const [activeSimulationFlow, setActiveSimulationFlow] = useState<string>('cold-chain');
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const architectureLayers = [
    {
      id: 1,
      title: 'Layer 1: Edge Telemetry & In-Store IoT Sensing Nodes',
      badge: 'Edge Ingestion',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Radio,
      description: 'Collects distributed sensory, transactional, and biometric signals from all franchise stores at 15–30 second intervals.',
      components: [
        {
          name: 'IoT Cold-Chain Thermal Probes',
          tech: 'BLE 5.2 / Zigbee Wireless',
          metric: '±0.1°C Precision',
          status: 'Active (142 Probes)',
          desc: 'Monitors walk-in freezers and display chillers. Triggers instant telemetry packets if temperature drifts above 4.0°C.',
        },
        {
          name: 'POS Register & Drawer Lock Sentinel',
          tech: 'Encrypted USB-C / Serial Bus',
          metric: '<50ms Event Stream',
          status: 'Active (48 Terminals)',
          desc: 'Streams manual discount overrides, voided orders, and drawer opening timestamps directly to the security event bus.',
        },
        {
          name: 'Store Camera RTSP Video Feed Ingest',
          tech: '1080p RTSP Stream / WebRTC',
          metric: '1 Frame / 5 Sec',
          status: 'Active (32 Cameras)',
          desc: 'Streams kitchen prep stations, uniform checkpoints, and dining areas to the AI computer vision edge buffer.',
        },
        {
          name: 'Biometric Timeclock & GPS Geofence Beacon',
          tech: 'Optical Fingerprint + GNSS GPS',
          metric: '<5m Geofence Radius',
          status: 'Active (6 Outlets)',
          desc: 'Validates on-duty staff attendance and cryptographically confirms district auditor physical presence on-site.',
        },
      ],
    },
    {
      id: 2,
      title: 'Layer 2: Real-Time Stream Ingestion & Telemetry Bus',
      badge: 'Event Streaming',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Network,
      description: 'High-throughput event streaming backbone buffering, deduplicating, and validating store telemetry with zero data loss.',
      components: [
        {
          name: 'Distributed Event Streaming Bus',
          tech: 'Apache Kafka / GCP PubSub',
          metric: '50,000 msgs/sec',
          status: 'Operational (0.2ms Latency)',
          desc: 'Buffers incoming telemetry bursts during peak dining hours and guarantees at-least-once message delivery.',
        },
        {
          name: 'Cryptographic Geofence & Signature Gateway',
          tech: 'ECDSA / SHA-256 Verification',
          metric: '100% Cryptographic Check',
          status: 'Active',
          desc: 'Verifies GPS coordinates, hardware MAC addresses, and digital auditor signatures before accepting inspection data.',
        },
        {
          name: 'Time-Series Data Buffering & Edge Store',
          tech: 'TimescaleDB / Redis Caching',
          metric: '30-Day Rolling Buffer',
          status: 'Active (1.8 GB/day)',
          desc: 'Maintains sub-second accessible operational telemetry for real-time drift calculations and offline sync.',
        },
      ],
    },
    {
      id: 3,
      title: 'Layer 3: Cognitive AI & Computer Vision Audit Engines',
      badge: 'AI Vision & Rules',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Cpu,
      description: 'Gemini 3.7 Cognitive Engine performs automated visual audits, OCR tax reconciliations, and statistical anomaly detection.',
      components: [
        {
          name: 'Gemini 3.7 Vision SOP Compliance Model',
          tech: 'Gemini 3.7 Flash Multimodal',
          metric: '380ms Inference Latency',
          status: 'Active (96.8% Accuracy)',
          desc: 'Automatically scans camera frames for aprons, hairnets, beard guards, glove compliance, and counter sanitization hygiene.',
        },
        {
          name: 'OCR Invoice & GST Tax Reconciler',
          tech: 'Deep OCR & Regex Parser',
          metric: '99.4% Extraction Rate',
          status: 'Active',
          desc: 'Parses printed guest checks and tax invoices to verify proper GST taxation, serial continuity, and unrecorded cash transactions.',
        },
        {
          name: 'Statistical Anomaly & Fraud Detector',
          tech: 'Isolation Forest / Z-Score ML',
          metric: 'Real-time Scoring',
          status: 'Active (0.02% False Positives)',
          desc: 'Detects unusual cashier void patterns, inventory recipe yield discrepancies, and excessive late opening occurrences.',
        },
      ],
    },
    {
      id: 4,
      title: 'Layer 4: Policy Governance, CAP State Machine & Ledger',
      badge: 'Core Business Logic',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Server,
      description: 'Orchestrates the formal Corrective Action Plan (CAP) lifecycle, multi-unit benchmarking, and tamper-proof audit certifications.',
      components: [
        {
          name: 'CAP 5-Stage Lifecycle State Machine',
          tech: 'Deterministic Workflow Engine',
          metric: 'Pending → In-Progress → Completed → Verified → Closed',
          status: 'Active (5 Live Tasks)',
          desc: 'Guarantees that critical violations automatically spawn remediation tickets with assigned managers and hard SLA countdowns.',
        },
        {
          name: 'Tamper-Proof Audit Vault & Signatures',
          tech: 'SHA-256 Chained Hash Ledger',
          metric: 'Immutable Audit Trail',
          status: 'Sealed & Valid',
          desc: 'Generates non-repudiable inspection records signed by district auditors with GPS and timestamp hashes.',
        },
        {
          name: 'Multi-Unit Benchmarking & SOP Sync',
          tech: 'Cross-Store Normalizer',
          metric: '6 Outlets Analyzed',
          status: 'Active',
          desc: 'Compares hygiene, speed, and audit pass rates across regional clusters to automatically propagate best practices.',
        },
      ],
    },
    {
      id: 5,
      title: 'Layer 5: Enterprise Presentation & Dispatch Layer',
      badge: 'Dispatch & UI',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Layers,
      description: 'Delivers intuitive real-time interfaces for store managers, mobile district auditors, and executive franchise leadership.',
      components: [
        {
          name: 'District Auditor Mobile Tablet Terminal',
          tech: 'React 18 + PWA Offline-First',
          metric: 'Zero-latency Local Cache',
          status: 'Active',
          desc: 'Provides seamless on-site checklist grading, photo evidence uploads, and instant digital signature capture.',
        },
        {
          name: 'Store Manager Instant Escalation Alerting',
          tech: 'WebSockets & Push API',
          metric: '<1.2s Delivery SLA',
          status: 'Active',
          desc: 'Notifies on-duty store managers immediately when critical temperature drifts or policy violations occur.',
        },
        {
          name: 'Executive Governance & ISO/HACCP Reports',
          tech: 'PDF Engine & Recharts Analytics',
          metric: 'ISO 22000 Ready',
          status: 'Active',
          desc: 'Generates print-ready formal compliance certificates, audit heatmaps, and franchise health rankings.',
        },
      ],
    },
  ];

  const simulationFlows = [
    {
      id: 'cold-chain',
      name: 'Cold-Chain Food Safety Alert Flow',
      icon: AlertTriangle,
      color: 'text-rose-600',
      steps: [
        {
          layer: 'Layer 1 (IoT Node)',
          title: 'Temperature Drift Detected',
          detail: 'Connaught Place walk-in chiller probe readings drift to 6.2°C (exceeding standard 4.0°C safety ceiling).',
          code: 'IOT_EVENT: {"nodeId": "probe-cp-02", "sensor": "temp", "val": 6.2, "unit": "C", "threshold": 4.0}',
        },
        {
          layer: 'Layer 2 (Stream Bus)',
          title: 'Event Streaming & Geofence Verification',
          detail: 'Ingestion pipeline validates sensor serial number, confirms hardware signature, and routes to priority queue.',
          code: 'STREAM_ROUTER: [HIGH_PRIORITY_FOOD_SAFETY] Latency 14ms -> Enqueue to AI Engine',
        },
        {
          layer: 'Layer 3 (AI Engine)',
          title: 'Anomaly Classification & Risk Assessment',
          detail: 'AI evaluates 15-minute slope trend. Confirms compressor failure risk and classifies violation severity as "Critical".',
          code: 'AI_DIAGNOSIS: {"severity": "Critical", "spoilageRisk": "High", "timeToHazard": "45mins"}',
        },
        {
          layer: 'Layer 4 (State Machine)',
          title: 'Automated CAP Task Generation',
          detail: 'System instantly creates Corrective Action Task #301 and assigns to Store Manager Mohan Das with 2-hour SLA.',
          code: 'WORKFLOW_ENGINE: Created CorrectiveTask(id="task-301", assignedTo="Store Mgr", due="2h")',
        },
        {
          layer: 'Layer 5 (Dispatch & Alert)',
          title: 'Instant Push Alert & Store Dispatch',
          detail: 'Store manager tablet sounds audible alert, and maintenance technician dispatch webhook is automatically triggered.',
          code: 'DISPATCH: Pushed Webhook -> Technician dispatched & Manager tablet illuminated.',
        },
      ],
    },
    {
      id: 'ai-vision',
      name: 'AI Vision Uniform & Hygiene Flow',
      icon: Camera,
      color: 'text-purple-600',
      steps: [
        {
          layer: 'Layer 1 (CCTV Ingest)',
          title: 'Video Snapshot Capture',
          detail: 'RTSP stream captures front kitchen assembly counter frame during 12:30 PM lunch rush window.',
          code: 'FRAME_CAPTURE: 1080p JPEG Frame @ 2026-08-14T12:30:15Z (Cam #04 - Assembly)',
        },
        {
          layer: 'Layer 2 (Stream Bus)',
          title: 'Frame Sanitization & Bus Buffer',
          detail: 'Image metadata verified and queued for parallel multimodal evaluation.',
          code: 'STREAM_BUFFER: Stream #04 -> Payload hash sha256:7f4a... (Size: 420KB)',
        },
        {
          layer: 'Layer 3 (Gemini 3.7 Vision)',
          title: 'Multimodal SOP Scan & Object Detection',
          detail: 'Gemini 3.7 inspects 4 staff members: 4/4 wearing aprons, 3/4 wearing caps (1 cashier missing official cap).',
          code: 'GEMINI_VISION: {"aprons": 4, "caps": 3, "gloves": 4, "uniformScore": 75, "issue": "Missing Cap"}',
        },
        {
          layer: 'Layer 4 (Governance Ledger)',
          title: 'Audit Record Scoring & Trend Update',
          detail: 'Branding & Uniform score adjusted to 75%. Policy violation logged under "Brand SOP Standards".',
          code: 'LEDGER_UPDATE: Outlet o-105 UniformScore -> 75% | Logged PolicyViolation #vio-208',
        },
        {
          layer: 'Layer 5 (Manager Terminal)',
          title: 'Store Dashboard Feedback',
          detail: 'Shift supervisor terminal highlights cashier #2 with visual notification to don approved brand cap.',
          code: 'UI_NOTIFY: Rendered visual alert on Store Floor Monitor -> "Staff Uniform Alert"',
        },
      ],
    },
    {
      id: 'audit-signoff',
      name: 'On-Site Cryptographic Audit Sign-Off Flow',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      steps: [
        {
          layer: 'Layer 1 (Mobile Terminal)',
          title: 'Inspector GPS Check-in',
          detail: 'District Manager logs in on tablet. GPS hardware confirms position is within 25 meters of Indiranagar outlet.',
          code: 'GNSS_CHECK: {"lat": 12.9716, "lng": 77.5946, "accuracy": "3.8m", "geofenceVerified": true}',
        },
        {
          layer: 'Layer 2 (Stream Bus)',
          title: 'Checklist Item Synchronization',
          detail: '15 operational checklist items streamed and verified against cloud regulatory standards.',
          code: 'SYNC_STREAM: 15 items confirmed -> Hash tree validated against current master SOP',
        },
        {
          layer: 'Layer 3 (AI Rule Validation)',
          title: 'Cross-Score Integrity Calculation',
          detail: 'Scores for Hygiene (95%), Speed (94%), and Compliance (96%) normalized to composite 95% (Grade A+).',
          code: 'SCORING_ENGINE: Weighted Composite Score = 95.0% -> Certified Grade A+',
        },
        {
          layer: 'Layer 4 (Ledger Vault)',
          title: 'Digital Signature & SHA-256 Sealing',
          detail: 'Auditor signature and GPS stamp are combined into an immutable block hash and permanently sealed.',
          code: 'BLOCK_SEAL: BlockHash = SHA256(AuditData + Timestamp + AuditorKey) -> #8f92b...a1',
        },
        {
          layer: 'Layer 5 (Certificate & ERP)',
          title: 'Official Certificate Issuance',
          detail: 'Print-ready compliance certificate generated; ERP system updates franchise compliance status.',
          code: 'CERT_MINTED: Certificate #CERT-2026-INDIRA-95 generated and ready for print.',
        },
      ],
    },
  ];

  const currentFlow = simulationFlows.find((f) => f.id === activeSimulationFlow) || simulationFlows[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Enterprise Quality Architecture v4.5
              </span>
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30">
                Zero-Trust Compliance Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Franchise Audit & Governance System Architecture
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
              Full-stack technical blueprint powering edge IoT sensory ingestion, Gemini 3.7 Computer Vision inspections, real-time policy state machines, and tamper-proof compliance certifications across all franchise outlets.
            </p>
          </div>

          {/* Architecture Health Stats */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-left min-w-[130px]">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">IoT Edge Nodes</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-lg font-black text-white">142 Online</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">100% Uptime</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-left min-w-[130px]">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">AI Vision Engine</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-lg font-black text-emerald-400">380ms</span>
              </div>
              <span className="text-[10px] text-slate-300 font-bold">Gemini 3.7 Flash</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-left min-w-[130px]">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Ledger Integrity</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-black text-white">SHA-256</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Cryptographically Sealed</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE 5-LAYER ARCHITECTURE EXPLORER */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Interactive 5-Layer End-to-End Architectural Stack</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any layer to inspect technical specifications, communication protocols, edge hardware, and algorithmic models.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {architectureLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedLayer === layer.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Layer {layer.id}
              </button>
            ))}
          </div>
        </div>

        {/* Layer Content View */}
        {(() => {
          const currentLayer = architectureLayers.find((l) => l.id === selectedLayer) || architectureLayers[0];
          const LayerIcon = currentLayer.icon;

          return (
            <div className="space-y-5">
              {/* Layer Header Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-slate-900 shrink-0">
                    <LayerIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md border ${currentLayer.badgeColor}`}>
                        {currentLayer.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1">{currentLayer.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{currentLayer.description}</p>
                  </div>
                </div>
              </div>

              {/* Sub-components Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentLayer.components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500/50 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {comp.tech}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {comp.metric}
                        </span>
                      </div>

                      <h5 className="font-extrabold text-slate-900 text-sm">{comp.name}</h5>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{comp.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Node Status:</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {comp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* SECTION 2: END-TO-END AUDIT DATA FLOW SIMULATOR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Interactive Telemetry Simulator
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-600" />
              <span>Real-Time Audit Event Pipeline Simulator</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an operational scenario to trace how edge events flow from in-store sensors through AI validation to executive resolution.
            </p>
          </div>

          {/* Flow Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {simulationFlows.map((flow) => {
              const FlowIcon = flow.icon;
              return (
                <button
                  key={flow.id}
                  onClick={() => {
                    setActiveSimulationFlow(flow.id);
                    setSimulationStep(0);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer border ${
                    activeSimulationFlow === flow.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <FlowIcon className={`w-3.5 h-3.5 ${activeSimulationFlow === flow.id ? 'text-emerald-400' : flow.color}`} />
                  <span>{flow.name.split(' ')[0]} Flow</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simulator Stepper Pipeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              {currentFlow.name} (Step {simulationStep + 1} of {currentFlow.steps.length})
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimulationStep((prev) => Math.max(0, prev - 1))}
                disabled={simulationStep === 0}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
              >
                Previous Step
              </button>
              <button
                onClick={() => setSimulationStep((prev) => Math.min(currentFlow.steps.length - 1, prev + 1))}
                disabled={simulationStep === currentFlow.steps.length - 1}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold rounded-lg text-xs cursor-pointer flex items-center gap-1"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Steps Breadcrumbs / Progress */}
          <div className="grid grid-cols-5 gap-2">
            {currentFlow.steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setSimulationStep(idx)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  simulationStep === idx
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : idx < simulationStep
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span>Step {idx + 1}</span>
                  {idx < simulationStep && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {simulationStep === idx && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <p className="text-xs font-extrabold truncate">{step.title}</p>
                <span className="text-[9px] opacity-80 block truncate">{step.layer}</span>
              </button>
            ))}
          </div>

          {/* Active Step Detailed Card with Simulated Code Telemetry */}
          {(() => {
            const activeStepData = currentFlow.steps[simulationStep];
            return (
              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-black rounded uppercase">
                      {activeStepData.layer}
                    </span>
                    <h4 className="font-extrabold text-sm text-white">{activeStepData.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Timestamp: 2026-08-14 10:14:32.412 UTC</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{activeStepData.detail}</p>

                {/* Simulated Telemetry / Event Packet */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">// Event Payload Packet:</span>
                  <p className="break-all">{activeStepData.code}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* SECTION 3: SECURITY, REGULATORY & RBAC GOVERNANCE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Regulatory Standard Compliance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="font-black text-sm">Regulatory Standards Compliance</h4>
          </div>
          <p className="text-xs text-slate-500">
            Architected to satisfy statutory food safety, digital audit trail, and fiscal invoicing mandates:
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="font-extrabold text-slate-900 block">HACCP & FSSAI Digital Logs</strong>
                <span className="text-[11px] text-slate-500">Continuous cold-chain temperature telemetry</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Certified
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="font-extrabold text-slate-900 block">ISO 22000 Quality Management</strong>
                <span className="text-[11px] text-slate-500">Documented 5-stage CAP resolution cycle</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Compliant
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="font-extrabold text-slate-900 block">GST Tax Serial Integrity</strong>
                <span className="text-[11px] text-slate-500">Zero unrecorded cash drawer overrides</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Cryptographic Security & Immutability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h4 className="font-black text-sm">Cryptographic Security & Verification</h4>
          </div>
          <p className="text-xs text-slate-500">
            Zero-trust security architecture protecting on-site inspection integrity:
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900">GPS Proof of Physical Presence</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-600">GNSS coordinates bound to device MAC & timestamp with 50m radius threshold.</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900">Digital Auditor Signature Hash</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-600">ECDSA cryptographic key pairs sign completed inspection records.</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900">In-Transit & At-Rest Encryption</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-600">TLS 1.3 encryption on all telemetry streams; AES-256 for document store.</p>
            </div>
          </div>
        </div>

        {/* Card 3: Multi-Tier RBAC Matrix */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Activity className="w-5 h-5 text-purple-600" />
            <h4 className="font-black text-sm">Role-Based Access Control (RBAC)</h4>
          </div>
          <p className="text-xs text-slate-500">
            Strict separation of audit duties and operational approvals across the fleet:
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center">
                <strong className="font-extrabold text-slate-900">Store Shift Manager</strong>
                <span className="text-[10px] font-mono text-slate-500">Level 1</span>
              </div>
              <span className="text-[11px] text-slate-600 block mt-0.5">Views live store telemetry, executes CAP task updates, submits cleaning logs.</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center">
                <strong className="font-extrabold text-slate-900">District Quality Auditor</strong>
                <span className="text-[10px] font-mono text-indigo-600 font-bold">Level 2</span>
              </div>
              <span className="text-[11px] text-slate-600 block mt-0.5">Conducts live on-site grading, creates policy violations, signs certificates.</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center">
                <strong className="font-extrabold text-slate-900">Franchise VP & Compliance Board</strong>
                <span className="text-[10px] font-mono text-emerald-700 font-black">Level 3 (Full)</span>
              </div>
              <span className="text-[11px] text-slate-600 block mt-0.5">Fleet-wide SOP modifications, AI threshold tuning, official audit revocations.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
