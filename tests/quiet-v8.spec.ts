import { test, expect, type Page } from '@playwright/test'
const at=(route:string)=>'/KasHima/#'+route
const memberRoutes=['/app','/app/tagihan','/app/riwayat','/app/leaderboard','/app/notifikasi','/app/profil','/app/pengaturan','/app/bantuan']
const financeRoutes=['/pengurus/keuangan','/pengurus/verifikasi','/pengurus/verifikasi/PAY-DEMO-001','/pengurus/anggota','/pengurus/anggota/u7','/pengurus/tunggakan','/pengurus/reminder','/pengurus/buku-kas','/pengurus/laporan','/pengurus/sengketa']
const chairRoutes=['/pengurus/persetujuan','/pengurus/periode','/pengurus/keanggotaan','/pengurus/kebijakan','/pengurus/akses','/pengurus/audit']
async function check(page:Page,route:string){
 await page.goto(at(route))
 await expect(page.locator('main#main')).toBeVisible()
 await expect(page.locator('.content-page').first()).toBeVisible()
 const data=await page.evaluate(()=>{
  const doc=document.documentElement,viewport=doc.clientWidth
  const brand=document.querySelector('.topbar-mobile .brand')?.getBoundingClientRect()
  const actions=document.querySelector('.topbar-actions')?.getBoundingClientRect()
  const nav=[...document.querySelectorAll<HTMLElement>('.bottom-nav .bottom-item')].filter(n=>getComputedStyle(n).display!=='none').map(n=>({label:n.textContent||'',diff:n.scrollWidth-n.clientWidth}))
  const headings=[...document.querySelectorAll<HTMLElement>('h1,h2')].filter(n=>getComputedStyle(n).display!=='none'&&n.getBoundingClientRect().width>0).map(n=>({label:(n.textContent||'').slice(0,40),diff:n.scrollWidth-n.clientWidth}))
  return{viewport,overflow:doc.scrollWidth-viewport,topbarOverlap:viewport<=850&&brand&&actions?brand.right-actions.left:0,nav,headings}
 })
 expect(data.overflow,route+' overflow '+JSON.stringify(data)).toBeLessThanOrEqual(2)
 expect(data.topbarOverlap,route+' header overlap '+JSON.stringify(data)).toBeLessThanOrEqual(3)
 for(const n of data.nav)expect(n.diff,route+' bottom label '+n.label).toBeLessThanOrEqual(2)
 for(const h of data.headings)expect(h.diff,route+' heading '+h.label).toBeLessThanOrEqual(3)
}
async function asRole(page:Page,name:RegExp){
 await page.goto(at('/app/profil'))
 await page.getByRole('button',{name:'Ganti akun demo'}).click()
 await page.getByRole('button',{name}).click()
}
test('member pages and four mobile destinations stay legible',async({page})=>{
 for(const route of memberRoutes)await check(page,route)
 await expect(page.locator('.bottom-nav .bottom-item')).toHaveCount(4)
})
test('member payment waiting and success guard remain intact',async({page})=>{
 await page.goto(at('/app/tagihan'))
 await page.getByRole('button',{name:/Bayar Rp/}).first().click()
 const id=page.url().match(/\/app\/bayar\/([^/#?]+)/)?.[1]
 expect(id).toBeTruthy()
 await check(page,'/app/bayar/'+id)
 await check(page,'/app/bayar/'+id+'/menunggu')
 await check(page,'/app/bayar/'+id+'/berhasil')
 await expect(page.getByRole('heading',{name:'Belum terverifikasi'})).toBeVisible()
})
test('treasurer all operational routes fit phone',async({page})=>{
 await asRole(page,/Hana Putri/)
 await expect(page.locator('html')).toHaveAttribute('data-workspace','treasurer')
 for(const route of financeRoutes)await check(page,route)
 await page.goto(at('/pengurus/keuangan'))
 await expect(page.getByText('Perlu diperiksa')).toBeVisible()
})
test('chair administration pages fit phone and prioritise approvals',async({page})=>{
 await asRole(page,/Kirana Laras/)
 await expect(page.locator('html')).toHaveAttribute('data-workspace','chair')
 for(const route of chairRoutes)await check(page,route)
 await page.goto(at('/pengurus/persetujuan'))
 await expect(page.getByLabel('Alur persetujuan')).toBeVisible()
})
test('Glass Studio still updates per-account blur',async({page})=>{
 await page.goto(at('/app/pengaturan'))
 const slider=page.locator('#glass-blur')
 await slider.focus()
 await slider.press('End')
 await expect(slider).toHaveValue('28')
 await expect.poll(()=>page.evaluate(()=>document.documentElement.style.getPropertyValue('--glass-blur'))).toBe('28px')
 await page.reload()
 await expect(slider).toHaveValue('28')
})
