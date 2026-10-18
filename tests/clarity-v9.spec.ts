import { expect, test, type Page } from '@playwright/test'
const at=(route:string)=>`/KasHima/#${route}`
const member=['/app','/app/tagihan','/app/riwayat','/app/leaderboard','/app/notifikasi','/app/profil','/app/pengaturan','/app/bantuan']
const finance=['/pengurus/keuangan','/pengurus/verifikasi','/pengurus/verifikasi/PAY-DEMO-001','/pengurus/anggota','/pengurus/anggota/u7','/pengurus/tunggakan','/pengurus/reminder','/pengurus/buku-kas','/pengurus/laporan','/pengurus/sengketa']
const chair=['/pengurus/persetujuan','/pengurus/periode','/pengurus/keanggotaan','/pengurus/kebijakan','/pengurus/akses','/pengurus/audit']
async function loginAs(page:Page,name:RegExp){
 await page.goto(at('/app/profil'))
 await page.getByRole('button',{name:'Ganti akun demo'}).click()
 await page.getByRole('button',{name}).click()
}
async function fit(page:Page,route:string){
 await page.goto(at(route))
 await expect(page.locator('main#main .content-page')).toBeVisible()
 const data=await page.evaluate(()=>{
  const vw=document.documentElement.clientWidth
  const selectors='.content-page h1,.content-page h2,.bottom-nav .bottom-item,.topbar-mobile .brand,.topbar-actions,.button,.card,.list-row,.form-field input,.form-field select'
  const violations=Array.from(document.querySelectorAll<HTMLElement>(selectors)).filter(el=>{
    const s=getComputedStyle(el),r=el.getBoundingClientRect()
    return s.display!=='none'&&s.visibility!=='hidden'&&s.position!=='absolute'&&r.height>0&&(r.left< -3||r.right>vw+3)
  }).slice(0,5).map(el=>({tag:el.tagName,cls:typeof el.className==='string'?el.className:'',text:el.textContent?.slice(0,20)}))
  const a=document.querySelector('.topbar-mobile .brand')?.getBoundingClientRect()
  const b=document.querySelector('.topbar-actions')?.getBoundingClientRect()
  return {overflow:document.documentElement.scrollWidth-vw,violations,headerOverlap:vw<=850&&a&&b?a.right-b.left:0}
 })
 expect(data.overflow,`${route} overflow: ${JSON.stringify(data)}`).toBeLessThanOrEqual(2)
 expect(data.violations,`${route} collisions ${JSON.stringify(data)}`).toEqual([])
 expect(data.headerOverlap,`${route} header overlap ${JSON.stringify(data)}`).toBeLessThanOrEqual(3)
}
test('Anggota: all key routes are navigable and fit the current screen',async({page})=>{
 for(const r of member)await fit(page,r)
 await expect(page.locator('.bottom-nav .bottom-item')).toHaveCount(4)
})
test('Bendahara: workflow and full operational menu remain accessible',async({page})=>{
 await loginAs(page,/Hana Putri/)
 for(const r of finance)await fit(page,r)
 await page.goto(at('/pengurus/keuangan'))
 await expect(page.locator('.finance-focus')).toBeVisible()
 await expect(page.getByRole('heading',{name:'Pembayaran terbaru'})).toBeVisible()
 const flow=page.locator('.flow-details')
 await expect(flow).not.toHaveAttribute('open','')
 await flow.locator('summary').click()
 await expect(flow).toHaveAttribute('open','')
})
test('Kahima: all governance routes and primary approvals link fit',async({page})=>{
 await loginAs(page,/Kirana Laras/)
 for(const r of chair)await fit(page,r)
 await page.goto(at('/pengurus/persetujuan'))
 await expect(page.locator('.bottom-nav').getByRole('link',{name:'Persetujuan'})).toBeVisible()
})
test('QRIS intent pending and blocked success remain safe',async({page})=>{
 await page.goto(at('/app/tagihan'))
 await page.getByRole('button',{name:/Bayar Rp/}).first().click()
 const m=page.url().match(/\/app\/bayar\/([^/#?]+)/)
 expect(m).toBeTruthy()
 for(const path of [`/app/bayar/${m?.[1]}`,`/app/bayar/${m?.[1]}/menunggu`,`/app/bayar/${m?.[1]}/berhasil`])await fit(page,path)
 await expect(page.getByRole('heading',{name:'Belum terverifikasi'})).toBeVisible()
})
test('Glass Studio slider and accessible modal remain functional',async({page})=>{
 await page.goto(at('/app/pengaturan'))
 const range=page.locator('#glass-blur')
 await range.focus();await range.press('End')
 await expect(range).toHaveValue('28')
 await expect.poll(()=>page.evaluate(()=>document.documentElement.style.getPropertyValue('--glass-blur'))).toBe('28px')
 await page.goto(at('/app/profil'))
 await page.getByRole('button',{name:'Edit profil'}).click()
 const modal=page.getByRole('dialog',{name:'Edit identitas'})
 await expect(modal).toBeVisible()
 await page.keyboard.press('Escape')
 await expect(modal).toHaveCount(0)
})
