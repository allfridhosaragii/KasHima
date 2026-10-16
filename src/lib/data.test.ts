import { describe,expect,it } from 'vitest'
import { IDR, monthName, ranking, seed, totalDues, userDues } from './data'

describe('KasHima demo domain fixtures',()=>{
 it('uses integer rupiah for all example obligations',()=>{const s=seed();expect(s.obligations.length).toBe(100);for(const ob of s.obligations){expect(Number.isInteger(ob.base)).toBe(true);expect(Number.isInteger(ob.fine)).toBe(true)}})
 it('does not include paid months in outstanding totals',()=>{const s=seed();expect(totalDues(s,'u1')).toBe(userDues(s,'u1').reduce((sum,o)=>sum+o.base+o.fine,0));expect(userDues(s,'u2')).toHaveLength(0)})
 it('formats monthly labels and currency in Indonesian',()=>{expect(monthName('2026-10')).toBe('Oktober 2026');expect(IDR(10000)).toContain('10.000')})
 it('does not rank unpaid members',()=>{const s=seed();const ranks=ranking(s);expect(ranks.some(x=>x.id==='u1')).toBe(false);expect(ranks.some(x=>x.id==='u2')).toBe(true)})
 it('initializes role groups correctly',()=>{const s=seed();expect(s.users.find(x=>x.id==='u5')?.role).toBe('treasurer');expect(s.users.find(x=>x.id==='u6')?.role).toBe('chair')})
})
