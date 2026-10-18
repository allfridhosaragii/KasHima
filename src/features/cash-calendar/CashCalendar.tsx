import {useEffect,useMemo,useState} from 'react'
import {Link} from 'react-router-dom'
import {CalendarDays,ChevronLeft,ChevronRight,Clock3,Download,List,Search,ShieldAlert} from 'lucide-react'
import {IDR,monthName} from '../../lib/data'
import {Empty} from '../../components/UI'
import type {StoreState,Payment,Obligation} from '../../lib/types'
import './cashCalendar.css'
type Kind='payment'|'expense'|'pending'
type Filter='all'|'normal'|'overdue'|'fine'|'pending'|'expense'
type Breakdown={normal:number;overdue:number;fine:number;unexplained:number}
type CashItem={id:string;date:string;time:string;name:string;reference:string;amount:number;kind:Kind;userId:string;breakdown:Breakdown;months:string[];possibleDuplicate:boolean;duplicateReference:boolean;intentId?:string}
const DAY_RE=/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/
const MONTH_RE=/^\d{4}-(0[1-9]|1[0-2])$/
const ZONE='Asia/Jakarta'
const DAY_FORMAT=new Intl.DateTimeFormat('en-GB',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'})
const TIME_FORMAT=new Intl.DateTimeFormat('id-ID',{timeZone:ZONE,hour:'2-digit',minute:'2-digit',hourCycle:'h23'})
export function wibDay(date:string|Date):string|null{
 if(typeof date==='string'&&DAY_RE.test(date)){
  const y=Number(date.slice(0,4)),m=Number(date.slice(5,7)),d=Number(date.slice(8,10))
  return new Date(Date.UTC(y,m-1,d)).toISOString().slice(0,10)===date?date:null
 }
 const instant=date instanceof Date?date:new Date(date)
 if(Number.isNaN(instant.getTime()))return null
 const parts=DAY_FORMAT.formatToParts(instant)
 const value=(type:string)=>parts.find(p=>p.type===type)?.value||''
 return value('year')+'-'+value('month')+'-'+value('day')
}
export function wibToday(){return wibDay(new Date())||'2026-10-18'}
export function monthOffset(month:string,n:number){
 if(!MONTH_RE.test(month))return month
 return new Date(Date.UTC(Number(month.slice(0,4)),Number(month.slice(5,7))-1+n,1)).toISOString().slice(0,7)
}
export function calendarGrid(month:string):(string|null)[]{
 if(!MONTH_RE.test(month))return []
 const y=Number(month.slice(0,4)),m=Number(month.slice(5,7))
 const leading=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7
 const days=new Date(Date.UTC(y,m,0)).getUTCDate()
 return Array.from({length:Math.ceil((leading+days)/7)*7},(_,i)=>{
  const d=i-leading+1
  return d>0&&d<=days?month+'-'+String(d).padStart(2,'0'):null
 })
}
const zero=():Breakdown=>({normal:0,overdue:0,fine:0,unexplained:0})
export function allocatePayment(p:Payment,obligations:Obligation[]):Breakdown{
 const breakdown=zero(),day=wibDay(p.paidAt),rows=p.obligationIds
  .map(id=>obligations.find(o=>o.id===id&&o.userId===p.userId))
  .filter((o):o is Obligation=>Boolean(o)).sort((a,b)=>a.month.localeCompare(b.month))
 let left=Math.max(0,p.amount)
 for(const row of rows){
  const principal=Math.min(left,Math.max(0,row.base))
  breakdown[day&&day>row.month+'-15'?'overdue':'normal']+=principal
  left-=principal
  const fine=Math.min(left,Math.max(0,row.fine))
  breakdown.fine+=fine;left-=fine
 }
 breakdown.unexplained=left
 return breakdown
}
const person=(state:StoreState,userId:string)=>state.users.find(u=>u.id===userId)?.name||'Anggota tidak diketahui'
const clock=(time:string)=>{const x=new Date(time);return Number.isNaN(x.getTime())?'Waktu tidak tersedia':TIME_FORMAT.format(x)+' WIB'}
export function createCashItems(state:StoreState):CashItem[]{
 const paid=state.payments.filter(p=>p.status==='verified').flatMap(p=>{
  const date=wibDay(p.paidAt)
  if(!date||!Number.isFinite(p.amount)||p.amount<0)return []
  return [{id:p.id,date,time:clock(p.paidAt),kind:'payment' as const,userId:p.userId,
   name:person(state,p.userId),reference:p.reference,amount:p.amount,breakdown:allocatePayment(p,state.obligations),
   months:[...new Set(p.obligationIds.map(id=>state.obligations.find(o=>o.id===id)?.month).filter((x):x is string=>Boolean(x)))],
   possibleDuplicate:false,duplicateReference:false}]
 })
 const expenses=state.expenses.flatMap(e=>{
  const date=wibDay(e.date)
  if(!date||!Number.isFinite(e.amount)||e.amount<0)return []
  return [{id:e.id,date,time:e.date.includes('T')?clock(e.date):'Tanggal pembukuan',kind:e.status==='approved'?'expense' as const:'pending' as const,
   name:e.title,userId:'',reference:e.id,amount:e.amount,breakdown:zero(),months:[],possibleDuplicate:false,duplicateReference:false}]
 })
 const pending=state.intents.filter(i=>i.status==='pending').flatMap(i=>{
  const date=wibDay(i.createdAt)
  if(!date)return []
  return [{id:i.id,date,time:clock(i.createdAt),kind:'pending' as const,reference:i.id,
   name:person(state,i.userId),userId:i.userId,amount:i.amount,breakdown:zero(),
   months:i.obligationIds.map(id=>state.obligations.find(o=>o.id===id)?.month||'').filter(Boolean),
   possibleDuplicate:false,duplicateReference:false,intentId:i.id}]
 })
 const all=[...paid,...expenses,...pending],refs=new Map<string,number>(),potential=new Map<string,number>()
 for(const event of paid){
  if(event.reference.trim()){const ref=event.reference.trim().toUpperCase();refs.set(ref,(refs.get(ref)||0)+1)}
  const key=event.userId+'|'+event.date+'|'+event.amount
  potential.set(key,(potential.get(key)||0)+1)
 }
 return all.map(item=>{
  if(item.kind!=='payment')return item
  return {...item,duplicateReference:!!item.reference.trim()&&(refs.get(item.reference.trim().toUpperCase())||0)>1,
   possibleDuplicate:(potential.get(item.userId+'|'+item.date+'|'+item.amount)||0)>1}
 }).sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time)||a.id.localeCompare(b.id))
}
export function cashTotals(items:CashItem[]){
 const t={received:0,normal:0,overdue:0,fine:0,unexplained:0,expense:0,pending:0,pendingCount:0,count:0,mixed:0,duplicate:0,sameAmount:0,payers:0}
 const amounts=new Map<number,number>(),unique=new Set<string>()
 for(const x of items){
  if(x.kind==='payment'){
   t.received+=x.amount;t.normal+=x.breakdown.normal;t.overdue+=x.breakdown.overdue
   t.fine+=x.breakdown.fine;t.unexplained+=x.breakdown.unexplained;t.count++
   if(x.breakdown.normal>0&&(x.breakdown.overdue>0||x.breakdown.fine>0))t.mixed++
   if(x.duplicateReference)t.duplicate++
   unique.add(x.userId||x.name);amounts.set(x.amount,(amounts.get(x.amount)||0)+1)
  }else if(x.kind==='expense')t.expense+=x.amount
  else{t.pending+=x.amount;t.pendingCount++}
 }
 t.payers=unique.size
 t.sameAmount=[...amounts.values()].filter(n=>n>1).reduce((a,b)=>a+b,0)
 return t
}
const filters:[Filter,string][]=[['all','Semua'],['normal','Iuran normal'],['overdue','Tunggakan'],['fine','Denda'],['pending','Perlu diperiksa'],['expense','Pengeluaran']]
function matches(x:CashItem,filter:Filter,query:string){
 const allowed=filter==='all'||(filter==='normal'&&x.kind==='payment'&&x.breakdown.normal>0)||
 (filter==='overdue'&&x.kind==='payment'&&x.breakdown.overdue>0)||
 (filter==='fine'&&x.kind==='payment'&&x.breakdown.fine>0)||
 (filter==='pending'&&x.kind==='pending')||(filter==='expense'&&x.kind==='expense')
 if(!allowed)return false
 const q=query.trim().toLocaleLowerCase('id-ID')
 if(!q)return true
 const numeric=q.replace(/[^0-9]/g,'')
 return [x.name,x.reference,x.id,...x.months].some(v=>v.toLocaleLowerCase('id-ID').includes(q))||
 (numeric.length>=2&&String(x.amount).includes(numeric))
}
function downloadCsv(items:CashItem[],month:string){
 const sanitize=(v:string|number)=>'"'+String(v).replace(/^\s*([=+@-])/,'\t$1').replaceAll('"','""')+'"'
 const rows=[['Tanggal WIB','Waktu','Nama/keperluan','Status','Total','Normal','Tunggakan','Denda','Belum dialokasi','Referensi'],...items.map(i=>[
  i.date,i.time,i.name,i.kind,String(i.amount),String(i.breakdown.normal),String(i.breakdown.overdue),
  String(i.breakdown.fine),String(i.breakdown.unexplained),i.reference])]
 const body='\uFEFF'+rows.map(r=>r.map(sanitize).join(',')).join('\r\n')
 const url=URL.createObjectURL(new Blob([body],{type:'text/csv;charset=utf-8'}))
 const anchor=document.createElement('a');anchor.href=url;anchor.download='kashima-kalender-'+month+'-DEMO.csv';anchor.click()
 window.setTimeout(()=>URL.revokeObjectURL(url),1500)
}
function Line({label,value}:{label:string;value:number}){return <div className="ck-line"><span>{label}</span><strong>{IDR(value)}</strong></div>}
function ReceiptRow({row}:{row:CashItem}){
 const b=row.breakdown
 const type=row.kind==='pending'?'Menunggu pemeriksaan':row.kind==='expense'?'Pengeluaran':
 b.normal>0&&(b.overdue>0||b.fine>0)?'Campuran':b.overdue>0||b.fine>0?'Tunggakan':'Iuran normal'
 return <details className="ck-row">
  <summary><span className="ck-row-sign">{row.kind==='expense'?'−':row.kind==='pending'?'?':'+'}</span>
   <span className="ck-row-main"><strong>{row.name}</strong><small>{row.time} · {type}</small></span>
   <span className="ck-row-value"><strong>{row.kind==='expense'?'−':row.kind==='payment'?'+':''}{IDR(row.amount)}</strong><small>{row.kind==='pending'?'Belum dihitung':'Data demo'}</small></span>
   <ChevronRight size={16} aria-hidden="true"/>
  </summary>
  <div className="ck-row-detail">
   {row.kind==='payment'&&<><Line label="Iuran normal" value={b.normal}/><Line label="Pokok tunggakan" value={b.overdue}/><Line label="Denda" value={b.fine}/>{b.unexplained>0&&<Line label="Belum dialokasikan" value={b.unexplained}/>}</>}
   {!!row.months.length&&<p>Periode: {row.months.map(monthName).join(', ')}</p>}
   <p>Referensi: {row.reference||'Tidak tersedia'}</p>
   {row.duplicateReference&&<p className="ck-warning">Referensi ini ditemukan lebih dari sekali. Perlu pemeriksaan.</p>}
   {!row.duplicateReference&&row.possibleDuplicate&&<p className="ck-warning">Anggota, nominal, dan tanggal sama dengan catatan lain. Perlu pemeriksaan.</p>}
   {row.kind==='pending'&&row.intentId&&<Link to={'/pengurus/verifikasi/'+row.intentId}>Buka verifikasi <ChevronRight size={15}/></Link>}
  </div>
 </details>
}
export function CashCalendar({state}:{state:StoreState}){
 const [today,setToday]=useState(wibToday)
 const [selected,setSelected]=useState(wibToday)
 const [month,setMonth]=useState(()=>wibToday().slice(0,7))
 const [followToday,setFollowToday]=useState(true)
 const [display,setDisplay]=useState<'calendar'|'list'>('calendar')
 const [filter,setFilter]=useState<Filter>('all')
 const [query,setQuery]=useState('')
 const [limit,setLimit]=useState(40)
 useEffect(()=>{
  const update=()=>setToday(wibToday())
  const timer=window.setInterval(update,30000)
  document.addEventListener('visibilitychange',update)
  window.addEventListener('focus',update)
  return()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',update);window.removeEventListener('focus',update)}
 },[])
 useEffect(()=>{if(followToday){setSelected(today);setMonth(today.slice(0,7))}},[today,followToday])
 const records=useMemo(()=>createCashItems(state),[state])
 const monthly=useMemo(()=>records.filter(r=>r.date.slice(0,7)===month),[records,month])
 const daily=useMemo(()=>records.filter(r=>r.date===selected),[records,selected])
 const totals=useMemo(()=>cashTotals(display==='calendar'?daily:monthly),[display,daily,monthly])
 const monthTotals=useMemo(()=>cashTotals(monthly),[monthly])
 const visible=useMemo(()=>(display==='calendar'?daily:monthly).filter(r=>matches(r,filter,query)),[display,daily,monthly,filter,query])
 const cal=useMemo(()=>calendarGrid(month),[month])
 const dayLookup=useMemo(()=>{const map=new Map<string,CashItem[]>();for(const item of monthly){const a=map.get(item.date)||[];a.push(item);map.set(item.date,a)}return map},[monthly])
 const changeMonth=(value:string)=>{
  if(!MONTH_RE.test(value))return
  setMonth(value);setSelected(value===today.slice(0,7)?today:value+'-01');setFollowToday(false);setLimit(40)
 }
 const goToday=()=>{setToday(wibToday());setMonth(wibToday().slice(0,7));setSelected(wibToday());setFollowToday(true);setDisplay('calendar')}
 const d=new Date(selected+'T12:00:00Z')
 const title=new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d)
 return <section className="ck-root" aria-label="Kalender Kas">
  <div className="ck-switch" role="group" aria-label="Mode tampilan">
   <button type="button" aria-pressed={display==='calendar'} onClick={()=>setDisplay('calendar')}><CalendarDays size={16}/> Kalender</button>
   <button type="button" aria-pressed={display==='list'} onClick={()=>setDisplay('list')}><List size={16}/> Daftar</button>
  </div>
  <div className="ck-month-total"><div><span>Penerimaan {monthName(month)}</span><strong>{IDR(monthTotals.received)}</strong><small>{monthTotals.count} pembayaran terverifikasi (demo)</small></div>
   <dl><div><dt>Iuran normal</dt><dd>{IDR(monthTotals.normal)}</dd></div><div><dt>Pokok tunggakan</dt><dd>{IDR(monthTotals.overdue)}</dd></div><div><dt>Denda</dt><dd>{IDR(monthTotals.fine)}</dd></div><div><dt>Pengeluaran</dt><dd>{IDR(monthTotals.expense)}</dd></div></dl>
  </div>
  <div className="ck-columns"><div className="ck-panel ck-calendar">
   <div className="ck-month-control"><button type="button" onClick={()=>changeMonth(monthOffset(month,-1))} aria-label="Bulan sebelumnya"><ChevronLeft size={18}/></button>
    <div><h2>{monthName(month)}</h2><label>Ganti bulan <input type="month" min="2020-01" max="2035-12" aria-label="Pilih bulan dan tahun" value={month} onChange={e=>changeMonth(e.target.value)}/></label></div>
    <button type="button" onClick={()=>changeMonth(monthOffset(month,1))} aria-label="Bulan berikutnya"><ChevronRight size={18}/></button>
   </div>
   <div className="ck-today"><span><Clock3 size={14}/> Zona waktu WIB</span><button type="button" onClick={goToday}>Hari ini</button></div>
   {display==='calendar'?<><div className="ck-week">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(d=><span key={d}>{d}</span>)}</div>
    <div className="ck-grid" role="group" aria-label="Pilih tanggal">
     {cal.map((date,index)=>{
      if(!date)return <span className="ck-empty-day" key={'blank-'+index} aria-hidden="true"/>
      const dt=cashTotals(dayLookup.get(date)||[])
      return <button type="button" key={date} className={(date===selected?'selected ':'')+(date===today?'today':'')}
       aria-pressed={date===selected} onClick={()=>{setSelected(date);setFollowToday(false);setLimit(40)}}
       aria-label={Number(date.slice(-2))+' '+monthName(month)+', '+dt.count+' pembayaran, '+dt.pendingCount+' menunggu'}>
       <span>{Number(date.slice(-2))}</span><span className="ck-dots" aria-hidden="true">
        {dt.normal>0&&<i className="normal"/>}{(dt.overdue>0||dt.fine>0)&&<i className="late"/>}{dt.pendingCount>0&&<i className="pending"/>}
       </span></button>
     })}
    </div>
    <div className="ck-legend"><span><i className="normal"/>Iuran normal</span><span><i className="late"/>Tunggakan/denda</span><span><i className="pending"/>Perlu diperiksa</span></div>
   </>:<p className="ck-list-hint">Daftar aktivitas seluruh bulan. Pilih kategori di bawah untuk mempersempit catatan.</p>}
  </div>
  <div className="ck-panel ck-detail" aria-live="polite"><div className="ck-detail-head"><div><small>{display==='calendar'?'RINCIAN HARIAN':'RINGKASAN BULANAN'}</small><h2>{display==='calendar'?title:monthName(month)}</h2></div><span>{totals.count} pembayaran</span></div>
   <div className="ck-received"><span>Total diterima</span><strong>{IDR(totals.received)}</strong><small>Pembayaran terverifikasi pada data demo</small></div>
   <div className="ck-detail-lines"><Line label="Iuran normal" value={totals.normal}/><Line label="Pokok tunggakan" value={totals.overdue}/><Line label="Denda" value={totals.fine}/><Line label="Pengeluaran" value={totals.expense}/><Line label="Selisih penerimaan − pengeluaran" value={totals.received-totals.expense}/></div>
   <div className="ck-details-meta"><span>{totals.payers} anggota membayar</span><span>{totals.mixed} pembayaran campuran</span>{totals.sameAmount>1&&<span>{totals.sameAmount} nominal sama</span>}</div>
   {totals.pendingCount>0&&<p className="ck-warning"><ShieldAlert size={15}/>{totals.pendingCount} catatan menunggu pemeriksaan dan tidak masuk total penerimaan.</p>}
   {totals.duplicate>0&&<p className="ck-warning"><ShieldAlert size={15}/>Referensi transaksi terulang. Periksa sebelum rekonsiliasi.</p>}
   {totals.unexplained>0&&<p className="ck-warning"><ShieldAlert size={15}/>Ada nominal yang belum dapat dialokasikan sepenuhnya.</p>}
  </div></div>
  <div className="ck-list-head"><div><h2>{display==='calendar'?'Aktivitas tanggal ini':'Aktivitas bulanan'}</h2><p>{display==='calendar'?title:monthName(month)} · {visible.length} catatan cocok</p></div><button type="button" disabled={!visible.length} onClick={()=>downloadCsv(visible,month)}><Download size={16}/> Ekspor CSV</button></div>
  <div className="ck-filters" role="group" aria-label="Filter transaksi">{filters.map(([key,label])=><button type="button" key={key} aria-pressed={filter===key} onClick={()=>{setFilter(key);setLimit(40)}}>{label}</button>)}</div>
  <label className="ck-search"><Search size={17}/><input type="search" aria-label="Cari anggota atau referensi" placeholder="Cari anggota atau referensi" value={query} onChange={e=>{setQuery(e.target.value);setLimit(40)}}/></label>
  <div className="ck-list" aria-label="Transaksi tanggal terpilih">
   {visible.length?visible.slice(0,limit).map(x=><ReceiptRow key={x.kind+'-'+x.id} row={x}/>):<Empty title="Belum ada transaksi" description="Tidak ada transaksi yang cocok dengan tanggal dan filter terpilih."/>}
  </div>
  {visible.length>limit&&<button type="button" className="ck-more" onClick={()=>setLimit(n=>n+40)}>Tampilkan 40 catatan berikutnya</button>}
  <p className="ck-demo-note">Data contoh tersimpan di browser. Kalender ini bukan laporan mutasi QRIS atau penerimaan bank yang sebenarnya.</p>
 </section>
}
