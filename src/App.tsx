import { Suspense, lazy } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { DemoProvider, useDemo } from './lib/store'
import { Login, Recovery } from './pages/AuthPages'
import { NotFound } from './components/UI'
const member = () => import('./pages/MemberPages')
const account = () => import('./pages/AccountPages')
const finance = () => import('./pages/FinancePages')
const admin = () => import('./pages/AdminPages')
const Home=lazy(()=>member().then(m=>({default:m.Home})))
const Dues=lazy(()=>member().then(m=>({default:m.Dues})))
const PaymentPage=lazy(()=>member().then(m=>({default:m.PaymentPage})))
const PaymentPending=lazy(()=>member().then(m=>({default:m.PaymentPending})))
const PaymentSuccess=lazy(()=>member().then(m=>({default:m.PaymentSuccess})))
const History=lazy(()=>member().then(m=>({default:m.History})))
const HistoryDetail=lazy(()=>member().then(m=>({default:m.HistoryDetail})))
const Leaderboard=lazy(()=>member().then(m=>({default:m.Leaderboard})))
const Profile=lazy(()=>account().then(m=>({default:m.Profile})))
const Settings=lazy(()=>account().then(m=>({default:m.Settings})))
const Notices=lazy(()=>account().then(m=>({default:m.Notices})))
const Help=lazy(()=>account().then(m=>({default:m.Help})))
const Finance=lazy(()=>finance().then(m=>({default:m.Finance})))
const Verification=lazy(()=>finance().then(m=>({default:m.Verification})))
const VerificationDetail=lazy(()=>finance().then(m=>({default:m.VerificationDetail})))
const Members=lazy(()=>finance().then(m=>({default:m.Members})))
const MemberDetail=lazy(()=>finance().then(m=>({default:m.MemberDetail})))
const Arrears=lazy(()=>finance().then(m=>({default:m.Arrears})))
const Reminders=lazy(()=>finance().then(m=>({default:m.Reminders})))
const Ledger=lazy(()=>finance().then(m=>({default:m.Ledger})))
const Reports=lazy(()=>finance().then(m=>({default:m.Reports})))
const Disputes=lazy(()=>finance().then(m=>({default:m.Disputes})))
const Approvals=lazy(()=>admin().then(m=>({default:m.Approvals})))
const Periods=lazy(()=>admin().then(m=>({default:m.Periods})))
const Membership=lazy(()=>admin().then(m=>({default:m.Membership})))
const Policies=lazy(()=>admin().then(m=>({default:m.Policies})))
const Roles=lazy(()=>admin().then(m=>({default:m.Roles})))
const AuditPage=lazy(()=>admin().then(m=>({default:m.AuditPage})))
function AuthGate(){const {current}=useDemo();return current?<Outlet/>:<Navigate to="/login" replace/>}
function AccessGate({role}:{role:'staff'|'chair'}){const {current}=useDemo();if(!current)return <Navigate to="/login" replace/>;if(role==='chair'&&current.role!=='chair')return <div className="content-page"><NotFound title="Halaman khusus Kahima" text="Kamu tidak mempunyai izin untuk mengakses pengaturan kepengurusan."/></div>;if(role==='staff'&&current.role==='member')return <div className="content-page"><NotFound title="Halaman khusus pengurus" text="Fitur ini hanya bisa diakses melalui akun pengurus."/></div>;return <Outlet/>}
function AuthRoutes(){const {current}=useDemo();return current?<Navigate to={current.role==='member'?'/app':current.role==='chair'?'/pengurus/persetujuan':'/pengurus/keuangan'} replace/>:<Login/>}
function Toast(){const {message,dismiss}=useDemo();return message?<div className="toast" role="status" onClick={dismiss}>{message}</div>:null}
function AppRoutes(){return <><Suspense fallback={<div className="route-loading" role="status">Memuat halaman KasHima…</div>}><Routes><Route path="/login" element={<AuthRoutes/>}/><Route path="/aktivasi" element={<Recovery/>}/><Route path="/lupa-password" element={<Recovery/>}/><Route path="/reset-password" element={<Recovery/>}/><Route element={<AuthGate/>}><Route element={<Shell/>}><Route path="/app" element={<Home/>}/><Route path="/app/tagihan" element={<Dues/>}/><Route path="/app/bayar/:intentId" element={<PaymentPage/>}/><Route path="/app/bayar/:intentId/menunggu" element={<PaymentPending/>}/><Route path="/app/bayar/:intentId/berhasil" element={<PaymentSuccess/>}/><Route path="/app/riwayat" element={<History/>}/><Route path="/app/riwayat/:paymentId" element={<HistoryDetail/>}/><Route path="/app/leaderboard" element={<Leaderboard/>}/><Route path="/app/notifikasi" element={<Notices/>}/><Route path="/app/profil" element={<Profile/>}/><Route path="/app/pengaturan" element={<Settings/>}/><Route path="/app/bantuan" element={<Help/>}/><Route element={<AccessGate role="staff"/>}><Route path="/pengurus/keuangan" element={<Finance/>}/><Route path="/pengurus/verifikasi" element={<Verification/>}/><Route path="/pengurus/verifikasi/:id" element={<VerificationDetail/>}/><Route path="/pengurus/anggota" element={<Members/>}/><Route path="/pengurus/anggota/:id" element={<MemberDetail/>}/><Route path="/pengurus/tunggakan" element={<Arrears/>}/><Route path="/pengurus/reminder" element={<Reminders/>}/><Route path="/pengurus/buku-kas" element={<Ledger/>}/><Route path="/pengurus/laporan" element={<Reports/>}/><Route path="/pengurus/sengketa" element={<Disputes/>}/></Route><Route element={<AccessGate role="chair"/>}><Route path="/pengurus/persetujuan" element={<Approvals/>}/><Route path="/pengurus/periode" element={<Periods/>}/><Route path="/pengurus/keanggotaan" element={<Membership/>}/><Route path="/pengurus/kebijakan" element={<Policies/>}/><Route path="/pengurus/akses" element={<Roles/>}/><Route path="/pengurus/audit" element={<AuditPage/>}/></Route><Route path="*" element={<NotFound/>}/></Route></Route><Route path="/" element={<Navigate to="/app" replace/>}/><Route path="*" element={<Navigate to="/app" replace/>}/></Routes></Suspense><Toast/></>}
export default function App(){return <DemoProvider><HashRouter><AppRoutes/></HashRouter></DemoProvider>}
