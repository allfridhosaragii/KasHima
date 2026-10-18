import {describe,it,expect} from 'vitest'
import {wibDay,wibToday,monthOffset,calendarGrid,allocatePayment,createCashItems,cashTotals} from './CashCalendar'
import {seed} from '../../lib/data'
import type {Payment} from '../../lib/types'
describe('cash calendar WIB date math',()=>{
 it('changes business date at 00:00 Asia/Jakarta',()=>{
  expect(wibDay('2026-10-17T16:59:59Z')).toBe('2026-10-17')
  expect(wibDay('2026-10-17T17:00:01Z')).toBe('2026-10-18')
  expect(wibDay('2026-10-11')).toBe('2026-10-11')
  expect(wibDay('2026-02-30')).toBeNull()
 })
 it('handles leap day and wraps months across years',()=>{
  expect(calendarGrid('2024-02').filter(Boolean)).toHaveLength(29)
  expect(calendarGrid('2026-02').filter(Boolean)).toHaveLength(28)
  expect(calendarGrid('2026-10').filter(Boolean)).toHaveLength(31)
  expect(monthOffset('2026-12',1)).toBe('2027-01')
  expect(monthOffset('2026-01',-1)).toBe('2025-12')
  expect(wibToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
 })
})
describe('verified payment attribution',()=>{
 it('splits one payment across overdue principal, fine and current principal',()=>{
  const state=seed()
  const prior=state.obligations.find(o=>o.userId==='u1'&&o.month==='2026-07')!
  const current=state.obligations.find(o=>o.userId==='u1'&&o.month==='2026-10')!
  prior.fine=60000
  const p:Payment={id:'TEST',userId:'u1',status:'verified',
   paidAt:'2026-10-05T09:00:00+07:00',reference:'ref1',amount:80000,
   obligationIds:[prior.id,current.id]}
  expect(allocatePayment(p,state.obligations)).toEqual({normal:10000,overdue:10000,fine:60000,unexplained:0})
  expect(allocatePayment({...p,amount:10000},state.obligations)).toEqual({normal:0,overdue:10000,fine:0,unexplained:0})
 })
 it('does not count pending payment as received money',()=>{
  const state=seed()
  const items=createCashItems(state)
  const pending=items.filter(x=>x.kind==='pending'&&x.id==='PAY-DEMO-001')
  expect(pending).toHaveLength(1)
  const t=cashTotals(pending)
  expect(t.received).toBe(0)
  expect(t.pending).toBe(70000)
  expect(t.pendingCount).toBe(1)
 })
 it('does not classify same amounts from different members as duplicate',()=>{
  const state=seed()
  state.payments=[
   {id:'tx1',userId:'u1',paidAt:'2026-10-05T09:00:00+07:00',
    reference:'unique1',amount:10000,status:'verified',obligationIds:[]},
   {id:'tx2',userId:'u2',paidAt:'2026-10-05T09:01:00+07:00',
    reference:'unique2',amount:10000,status:'verified',obligationIds:[]}]
  const items=createCashItems(state).filter(x=>x.kind==='payment')
  expect(items.every(x=>!x.duplicateReference&&!x.possibleDuplicate)).toBe(true)
  expect(cashTotals(items).sameAmount).toBe(2)
 })
 it('flags repeated merchant references but counts separate rows for audit',()=>{
  const state=seed()
  state.payments=[
   {id:'tx1',userId:'u1',paidAt:'2026-10-05T09:00:00+07:00',
    reference:'duplicate-x',amount:10000,status:'verified',obligationIds:[]},
   {id:'tx2',userId:'u2',paidAt:'2026-10-05T09:01:00+07:00',
    reference:'duplicate-x',amount:10000,status:'verified',obligationIds:[]}]
  const items=createCashItems(state).filter(x=>x.kind==='payment')
  expect(items.every(x=>x.duplicateReference)).toBe(true)
  expect(cashTotals(items).duplicate).toBe(2)
 })
 it('keeps approved expenses outside pending expenses',()=>{
  const state=seed()
  state.payments=[]
  state.intents=[]
  state.expenses=[
   {id:'e1',title:'Pembelian barang',status:'approved',amount:50000,date:'2026-10-05',by:'u5'},
   {id:'e2',title:'Usulan saja',status:'pending',amount:30000,date:'2026-10-05',by:'u5'}]
  const totals=cashTotals(createCashItems(state))
  expect(totals.expense).toBe(50000)
  expect(totals.pending).toBe(30000)
  expect(totals.received).toBe(0)
 })
})
