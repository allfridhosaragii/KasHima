import { ArrowDownToLine, CircleCheck2, FileClock, Receipt, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
type FlowMode = 'member' | 'finance' | 'chair'
type Step = { title:string;detail:string;icon:LucideIcon }
const steps:Record<FlowMode,Step[]> = {
 member:[{title:'Tagihan',detail:'Kewajiban bulanan',icon:Receipt},{title:'Pembayaran',detail:'Metode tersedia',icon:ArrowDownToLine},{title:'Pemeriksaan',detail:'Validasi penerimaan',icon:ShieldCheck},{title:'Tercatat',detail:'Riwayat kas',icon:CircleCheck2}],
 finance:[{title:'Masuk',detail:'Transaksi diajukan',icon:ArrowDownToLine},{title:'Periksa',detail:'Cocokkan bukti',icon:ShieldCheck},{title:'Putuskan',detail:'Setujui atau tolak',icon:FileClock},{title:'Arsipkan',detail:'Masuk buku kas',icon:Receipt}],
 chair:[{title:'Pengajuan',detail:'Usulan diterima',icon:Receipt},{title:'Peninjauan',detail:'Periksa dampak',icon:ShieldCheck},{title:'Persetujuan',detail:'Keputusan pengurus',icon:CircleCheck2},{title:'Audit',detail:'Jejak keputusan',icon:FileClock}]
}
export function MoneyFlow({mode='member',hasAction=false}:{mode?:FlowMode,hasAction?:boolean}){
 const name=mode==='member'?'Perjalanan pembayaran':mode==='finance'?'Alur verifikasi kas':'Alur persetujuan';
 const href=mode==='member'?'/app/tagihan':mode==='finance'?'/pengurus/verifikasi':'/pengurus/persetujuan';
 return <section className="flowboard" aria-label={name}><div className="flowboard-title"><strong>{name}</strong><small>4 tahapan</small></div>
 <div className="flowboard-track">{steps[mode].map(({icon:Icon,title,detail},i)=><div className={'flowboard-node '+(i===0?'is-ready':'')} key={title}><span className="flowboard-node-icon"><Icon size={21} strokeWidth={1.7}/></span><strong>{title}</strong><small>{detail}</small></div>)}</div>
 <div className="flowboard-footer">{hasAction?<Link to={href} className="subtle-link">Buka {mode==='member'?'tagihan':mode==='finance'?'antrean':'persetujuan'} <span aria-hidden="true">→</span></Link>:<span>Diagram proses, bukan bukti pembayaran.</span>}</div></section>
}
