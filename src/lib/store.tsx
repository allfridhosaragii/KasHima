import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { makeId, nowIso, seed } from './data'
import type { Audit, MemberStatus, PaymentIntent, Proposal, Role, StoreState, User, Expense, Notice, Ticket } from './types'
const KEY='kashima-react-v1'
const PREVIOUS_KEY='kashima-premium-preview-2026-v1'
function load(): StoreState {
 try {
  const data=localStorage.getItem(KEY)
  if(data){const parsed=JSON.parse(data) as StoreState;if(parsed.users?.length&&Array.isArray(parsed.obligations))return parsed}
  const s=seed()
  const old=localStorage.getItem(PREVIOUS_KEY)
  if(old){const previous=JSON.parse(old) as {users?:Partial<User>[];theme?:'light'|'dark'}
   for(const u of s.users){const match=previous.users?.find(x=>x.id===u.id);if(!match)continue
    if(typeof match.name==='string')u.name=match.name
    if(typeof match.nickname==='string')u.nickname=match.nickname
    if(typeof match.avatar==='string')u.avatar=match.avatar
    if(match.role&&['member','treasurer','chair'].includes(match.role))u.role=match.role
    if(match.theme)u.theme=match.theme
    if(previous.theme)u.theme=previous.theme
    const a=(match as unknown as {appearance?:{glassStyle?:string;glassBlur?:number}}).appearance
    if(a&&['solid','satin','frost','crystal','none'].includes(a.glassStyle||'')) u.glass=a.glassStyle==='none'?'solid':a.glassStyle as User['glass']
    if(typeof a?.glassBlur==='number')u.blur=Math.max(0,Math.min(28,a.glassBlur))
   }
  }
  return s
 }catch{return seed()}
}
interface DemoActions {
 state: StoreState
 current: User | undefined
 update: (fn:(old:StoreState)=>StoreState) => void
 updateUser: (id:string,changes:Partial<User>) => void
 login: (id:string)=>void
 logout: ()=>void
 reset: ()=>void
 startPayment: (userId:string,ids:string[])=>PaymentIntent
 verifyPayment: (id:string,approver:string)=>void
 rejectPayment: (id:string,approver:string)=>void
 createTicket: (userId:string,title:string,message:string)=>void
 addExpense: (by:string,title:string,amount:number)=>void
 addProposal: (by:string,title:string,detail:string,amount:number)=>void
 decideProposal: (id:string,approver:string,approve:boolean)=>void
 changeRole: (id:string,role:Role,by:string)=>void
 changeStatus:(id:string,status:MemberStatus,by:string)=>void
 addMember:(user:User,by:string)=>void
 markNotices: (userId:string)=>void
 notify:(text:string)=>void
 message:string
 dismiss:()=>void
}
const Context=createContext<DemoActions|null>(null)
export function DemoProvider({children}:{children:ReactNode}){
 const [state,setState]=useState<StoreState>(load)
 const [message,setMessage]=useState('')
 const current=state.users.find(u=>u.id===state.currentUserId)
 const update=useCallback((fn:(old:StoreState)=>StoreState)=>setState(s=>fn(structuredClone(s))),[])
 const notify=useCallback((text:string)=>setMessage(text),[])
 const dismiss=useCallback(()=>setMessage(''),[])
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{setMessage('Penyimpanan perangkat penuh. Perubahan mungkin tidak tersimpan.')}},[state])
 useEffect(()=>{const t=setTimeout(()=>setMessage(''),4300);return()=>clearTimeout(t)},[message])
 const log=(s:StoreState,text:string,by:string):void=>{const a:Audit={id:makeId('AUD'),text,by,date:nowIso()};s.audit.unshift(a)}
 const updateUser=(id:string,changes:Partial<User>)=>update(s=>{const u=s.users.find(x=>x.id===id);if(u)Object.assign(u,changes);return s})
 const login=(id:string)=>update(s=>{const u=s.users.find(x=>x.id===id);if(u?.status==='active')s.currentUserId=id;return s})
 const logout=()=>update(s=>({...s,currentUserId:null}))
 const reset=()=>{setState(seed());setMessage('Data contoh diatur ulang.')}
 const startPayment=(userId:string,ids:string[]):PaymentIntent=>{
  const obligations=state.obligations.filter(o=>o.userId===userId&&o.status==='due'&&ids.includes(o.id))
  const amount=obligations.reduce((x,o)=>x+o.base+o.fine,0)
  const intent:PaymentIntent={id:makeId('PAY'),userId,obligationIds:obligations.map(o=>o.id),amount,status:'pending',createdAt:nowIso()}
  if(amount>0)update(s=>{s.intents.unshift(intent);log(s,`Tagihan demo ${intent.id} dibuat`,state.users.find(u=>u.id===userId)?.name||'Akun');return s})
  return intent
 }
 const verifyPayment=(id:string,approver:string)=>update(s=>{const p=s.intents.find(x=>x.id===id);if(!p||p.status!=='pending')return s
  p.status='verified';p.verifiedAt=nowIso();p.reference=makeId('SIM');
  for(const oid of p.obligationIds){const due=s.obligations.find(x=>x.id===oid);if(due&&due.userId===p.userId)due.status='paid'}
  s.payments.push({id:makeId('TRX'),userId:p.userId,amount:p.amount,obligationIds:p.obligationIds,paidAt:nowIso(),reference:p.reference,status:'verified'})
  log(s,`Pembayaran demo ${p.id} disetujui`,approver);return s
 })
 const rejectPayment=(id:string,approver:string)=>update(s=>{const p=s.intents.find(x=>x.id===id);if(p?.status==='pending'){p.status='rejected';log(s,`Pembayaran demo ${id} ditolak`,approver)}return s})
 const createTicket=(userId:string,title:string,body:string)=>update(s=>{const t:Ticket={id:makeId('TIK'),userId,title,message:body,status:'open',date:nowIso()};s.tickets.unshift(t);return s})
 const addExpense=(by:string,title:string,amount:number)=>update(s=>{const expense:Expense={id:makeId('EXP'),title,amount,date:nowIso(),status:'pending',by};s.expenses.unshift(expense);s.proposals.unshift({id:makeId('APR'),title:`Pengeluaran: ${title}`,detail:'Permohonan persetujuan penggunaan kas',amount,status:'submitted',by,date:nowIso()});log(s,`Pengeluaran ${title} diajukan`,by);return s})
 const addProposal=(by:string,title:string,detail:string,amount:number)=>update(s=>{const prop:Proposal={id:makeId('APR'),title,detail,amount,status:'submitted',by,date:nowIso()};s.proposals.unshift(prop);log(s,`Usulan ${title} dibuat`,by);return s})
 const decideProposal=(id:string,approver:string,approve:boolean)=>update(s=>{const p=s.proposals.find(x=>x.id===id);if(!p||p.status!=='submitted'||p.by===approver)return s;p.status=approve?'approved':'rejected';if(p.title.startsWith('Pengeluaran: ')){const title=p.title.replace('Pengeluaran: ','');const expense=s.expenses.find(x=>x.title===title&&x.by===p.by&&x.status==='pending');if(expense)expense.status=approve?'approved':'rejected'}log(s,`Usulan ${p.title} ${approve?'disetujui':'ditolak'}`,approver);return s})
 const changeRole=(id:string,role:Role,by:string)=>update(s=>{const actor=s.users.find(x=>x.id===by);const target=s.users.find(x=>x.id===id);if(actor?.role!=='chair'||!target||target.id===by||target.role===role)return s
   const old=target.role;target.role=role;log(s,`Peran ${target.name}: ${old} → ${role} (simulasi)`,actor.name);return s
 })
 const changeStatus=(id:string,status:MemberStatus,by:string)=>update(s=>{const actor=s.users.find(x=>x.id===by);const target=s.users.find(x=>x.id===id);if(actor?.role!=='chair'||!target||target.id===by||target.status===status)return s
  target.status=status;log(s,`Status ${target.name} diubah menjadi ${status} (simulasi)`,actor.name);return s
 })
 const addMember=(u:User,by:string)=>update(s=>{const actor=s.users.find(x=>x.id===by);if(actor?.role!=='chair'||s.users.some(x=>x.nim===u.nim))return s;s.users.push(u);log(s,`Anggota ${u.name} ditambahkan (simulasi)`,actor.name);return s})
 const markNotices=(userId:string)=>update(s=>{s.notices.filter(n=>n.userId===userId).forEach((n:Notice)=>{n.read=true});return s})
 const value=useMemo<DemoActions>(()=>({state,current,update,updateUser,login,logout,reset,startPayment,verifyPayment,rejectPayment,createTicket,addExpense,addProposal,decideProposal,changeRole,changeStatus,addMember,markNotices,notify,message,dismiss}),[state,current,update,message,notify,dismiss])
 return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useDemo(){const ctx=useContext(Context);if(!ctx)throw new Error('DemoProvider missing');return ctx}
