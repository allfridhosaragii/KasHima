import { ArrowDownToLine, ChevronDown, CircleCheck, FileClock, Receipt, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
type FlowMode = 'member' | 'finance' | 'chair'
type Step = { title:string;detail:string;icon:LucideIcon }
const steps:Record<FlowMode,Step[]> = {
 member:[{title:'Tagihan',detail:'Kewajiban bulanan',icon:Receipt},{title:'Pembayaran',detail:'Metode tersedia',icon:ArrowDownToLine},{title:'Pemeriksaan',detail:'Validasi penerimaan',icon:ShieldCheck},{title:'Tercatat',detail:'Riwayat kas',icon:CircleCheck}],
 finance:[{title:'Masuk',detail:'Transaksi diajukan',icon:ArrowDownToLine},{title:'Periksa',detail:'Cocokkan bukti',icon:ShieldCheck},{title:'Putuskan',detail:'Setujui atau tolak',icon:FileClock},{title:'Arsipkan',detail:'Masuk buku kas',icon:Receipt}],
 chair:[{title:'Pengajuan',detail:'Usulan diterima',icon:Receipt},{title:'Peninjauan',detail:'Periksa dampak',icon:ShieldCheck},{title:'Persetujuan',detail:'Keputusan pengurus',icon:CircleCheck},{title:'Audit',detail:'Jejak keputusan',icon:FileClock}]
}
export function MoneyFlow({mode='member',hasAction=false}:{mode?:FlowMode,hasAction?:boolean}){
 const name=mode==='member'?'Perjalanan pembayaran':mode==='finance'?'Alur verifikasi kas':'Alur persetujuan';
 const href=mode==='member'?'/app/tagihan':mode==='finance'?'/pengurus/verifikasi':'/pengurus/persetujuan';
 return <details className="flowboard flow-details" aria-label={name}>
 <summary className="flow-summary"><span><strong>{name}</strong><small>Penjelasan singkat 4 tahap</small></span><span className="flow-summary-more">Lihat alur <ChevronDown size={17}/></span></summary>
 <div className="flow-details-body">
 <div className="flowboard-track">{steps[mode].map(({icon:Icon,title,detail},i)=><div className={'flowboard-node '+(i===0?'is-ready':'')} key={title}><span className="flowboard-node-icon"><Icon size={21} strokeWidth={1.7}/></span><strong>{title}</strong><small>{detail}</small></div>)}</div>
 <div className="flowboard-footer">{hasAction?<Link to={href} className="subtle-link">Buka {mode==='member'?'tagihan':mode==='finance'?'antrean':'persetujuan'} <span aria-hidden="true">→</span></Link>:<span>Diagram proses, bukan bukti pembayaran.</span>}</div>
 </div></details>
}
