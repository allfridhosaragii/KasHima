import type { StoreState, Role, User, Obligation, Payment } from './types'
export const TODAY_MONTH = '2026-10'
export const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
export const IDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
export const number = (n: number) => new Intl.NumberFormat('id-ID').format(n)
export const monthName = (ym: string) => { const [year, month] = ym.split('-'); return `${MONTHS[Math.max(0,Number(month)-1)]} ${year}` }
export const shortDate = (date: string) => new Intl.DateTimeFormat('id-ID',{ day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Jakarta' }).format(new Date(date))
export const nowIso = () => new Date().toISOString()
export const makeId = (prefix: string) => `${prefix}-${globalThis.crypto?.randomUUID?.()?.slice(0,8) ?? Math.random().toString(36).slice(2,10)}`
export const initials = (name: string) => name.trim().split(/\s+/).slice(0,2).map(x=>x[0] ?? '').join('').toUpperCase()
export const roleTitle = (role: Role) => ({member:'Anggota',treasurer:'Bendahara',chair:'Kahima'})[role]
export const statusTitle = (status: User['status']) => ({active:'Aktif',leave:'Cuti',inactive:'Nonaktif',alumni:'Alumni'})[status]
export const userDues = (store: StoreState,id: string) => store.obligations.filter(o=>o.userId===id && o.status==='due').sort((a,b)=>a.month.localeCompare(b.month))
export const totalDues = (store: StoreState,id: string) => userDues(store,id).reduce((n,o)=>n+o.base+o.fine,0)
export const getUser = (store: StoreState,id: string) => store.users.find(u=>u.id===id)
export const ranking = (store: StoreState,month=TODAY_MONTH) => {
 const ids = new Set(store.obligations.filter(o=>o.month===month).map(o=>o.id))
 const first = new Map<string, string>()
 for (const p of store.payments.filter(p=>p.status==='verified'&&p.obligationIds.some(i=>ids.has(i)))) {
  if (!first.has(p.userId)||p.paidAt<first.get(p.userId)!) first.set(p.userId,p.paidAt)
 }
 return [...first.entries()].sort((a,b)=>a[1].localeCompare(b[1])).map(([id,paidAt],i)=>({id,paidAt,rank:i+1,user:getUser(store,id)}))
}
export function seed(): StoreState {
 const profiles: [string,string,string,string,Role][] = [
  ['u1','Raka Pratama','240000001','2024','member'],['u2','Nadia Aryani','240000002','2024','member'],
  ['u3','Bima Satria','240000003','2024','member'],['u4','Alya Kirana','230000004','2023','member'],
  ['u5','Hana Putri','230000005','2023','treasurer'],['u6','Kirana Laras','220000006','2022','chair'],
  ['u7','Dimas Aditya','240000007','2024','member'],['u8','Farah Safitri','230000008','2023','member'],
  ['u9','Naufal Malik','240000009','2024','member'],['u10','Amira Zahra','220000010','2022','member']
 ]
 const users: User[] = profiles.map(([id,name,nim,year,role])=>({id,name,nickname:name.split(' ')[0],nim,year,role,status:'active',theme:'light',glass:'frost',blur:16,notify:true,phone:'6281234567890'}))
 const obligations: Obligation[]=[]; const payments: Payment[]=[];let seq=1
 users.forEach((u,index)=>{
  for(let m=1;m<=10;m++) {
   const month=`2026-${String(m).padStart(2,'0')}`
   const paid=m<=8||(m===9&& ![0,6,8].includes(index))||(m===10&&[1,2,3,4,5,7].includes(index))
   const obligation:Obligation={id:`ob-${u.id}-${month}`,userId:u.id,month,base:10000,fine:paid?0:60000,status:paid?'paid':'due'}
   obligations.push(obligation)
   if(paid){const day=m===10?Math.min(index+1,9):Math.min(index+2,12);const at=`2026-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}T09:15:00+07:00`;payments.push({id:`TRX-${String(seq++).padStart(5,'0')}`,userId:u.id,obligationIds:[obligation.id],amount:10000,paidAt:at,reference:`SIM-${String(seq).padStart(7,'0')}`,status:'verified'})}
  }
 })
 return {users,obligations,payments,intents:[{id:'PAY-DEMO-001',userId:'u7',obligationIds:['ob-u7-2026-10'],amount:70000,status:'pending',createdAt:'2026-10-16T09:14:00+07:00'}],notices:[{id:'n1',userId:'u1',title:'Kas Oktober melewati tenggat',body:'Periksa kembali iuran dan denda pada halaman tagihan.',read:false,date:nowIso()}],tickets:[],expenses:[{id:'EXP-01',title:'Konsumsi rapat pengurus',amount:150000,date:'2026-10-11',status:'approved',by:'u5'}],proposals:[],audit:[{id:'a1',text:'Data awal demonstrasi disiapkan',date:nowIso(),by:'Sistem'}],currentUserId:'u1',period:'2026/2027',duesFee:10000,fineFee:60000}
}
