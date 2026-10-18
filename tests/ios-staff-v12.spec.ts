import { expect, test, type Page } from '@playwright/test'

const at=(route:string)=>`/KasHima/#${route}`
const finance=[
 '/pengurus/keuangan','/pengurus/verifikasi','/pengurus/verifikasi/PAY-DEMO-001',
 '/pengurus/anggota','/pengurus/anggota/u7','/pengurus/tunggakan',
 '/pengurus/reminder','/pengurus/buku-kas','/pengurus/laporan','/pengurus/sengketa',
]
const admin=[
 '/pengurus/persetujuan','/pengurus/periode','/pengurus/keanggotaan',
 '/pengurus/kebijakan','/pengurus/akses','/pengurus/audit',
]
async function asRole(page:Page,name:RegExp){
 await page.goto(at('/app/profil'))
 await page.getByRole('button',{name:'Ganti akun demo'}).click()
 await page.getByRole('button',{name}).click()
}
async function checkFit(page:Page,route:string,width:number){
 await page.setViewportSize({width,height:850})
 await page.goto(at(route))
 await expect(page.locator('main#main .content-page')).toBeVisible()
 const x=await page.evaluate(()=>{
  const max=document.documentElement.clientWidth
  const title=document.querySelector<HTMLElement>('main#main .content-page h1')
  const surface=document.querySelector<HTMLElement>('main#main .content-page')
  const nav=document.querySelector<HTMLElement>('.bottom-nav')
  const header=document.querySelector<HTMLElement>('.topbar')
  const bad=Array.from(document.querySelectorAll<HTMLElement>(
   'main#main .content-page .card,main#main .content-page .list-row,main#main .content-page .page-head,main#main .content-page .button,main#main .content-page input,main#main .content-page select'
  )).filter(el=>{
    const c=getComputedStyle(el),r=el.getBoundingClientRect()
    return c.display!=='none'&&c.visibility!=='hidden'&&r.height>0&&(r.left< -3||r.right>max+3)
  }).slice(0,4).map(e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'',text:e.textContent?.slice(0,20)}))
  const b=document.querySelector('.topbar-mobile .brand')?.getBoundingClientRect()
  const a=document.querySelector('.topbar-actions')?.getBoundingClientRect()
  return {
    horizontal:document.documentElement.scrollWidth-max,
    title:title?.getBoundingClientRect().width??0,
    surface:surface?.getBoundingClientRect().width??0,
    header:header?.getBoundingClientRect().height??0,
    nav:nav?.getBoundingClientRect().height??0,
    overlap:max<=850&&b&&a?b.right-a.left:0,
    bad,
  }
 })
 expect(x.horizontal,`${route} ${width}px horizontal overflow: ${JSON.stringify(x)}`).toBeLessThanOrEqual(2)
 expect(x.bad,`${route} ${width}px misaligned: ${JSON.stringify(x)}`).toEqual([])
 expect(x.overlap,`${route} ${width}px header collision: ${JSON.stringify(x)}`).toBeLessThanOrEqual(2)
 expect(x.title,`${route} ${width}px heading missing`).toBeGreaterThan(0)
 expect(x.surface,`${route} ${width}px page missing`).toBeGreaterThan(100)
}
test('Treasurer: all ten pages remain readable from 320 through desktop',async({page})=>{
 test.setTimeout(210000)
 await asRole(page,/Hana Putri/)
 for(const route of finance){
   for(const w of [320,390,430,1024]){
     await checkFit(page,route,w)
   }
 }
 for(const w of [360,768,1440]){
   for(const route of ['/pengurus/keuangan','/pengurus/verifikasi','/pengurus/buku-kas','/pengurus/laporan']){
     await checkFit(page,route,w)
   }
 }
})
test('Chair and administration: all six pages readable and no mobile sidebar',async({page})=>{
 test.setTimeout(210000)
 await asRole(page,/Kirana Laras/)
 for(const route of admin){
  for(const w of [320,390,430,1024]){
   await checkFit(page,route,w)
   if(w<=430){
    await expect(page.locator('.sidebar')).toBeHidden()
    await expect(page.locator('.bottom-nav').getByRole('link',{name:'Profil',exact:true})).toBeVisible()
   }
  }
 }
 for(const w of [360,768,1440]){
   for(const route of ['/pengurus/persetujuan','/pengurus/kebijakan','/pengurus/akses']){
     await checkFit(page,route,w)
   }
 }
})
test('Staff mobile menu uses grouped destinations without opening a sidebar drawer',async({page})=>{
 await asRole(page,/Kirana Laras/)
 await page.setViewportSize({width:320,height:740})
 await page.goto(at('/pengurus/persetujuan'))
 const menu=page.locator('.mobile-workspace-menu')
 await menu.locator('summary').click()
 for(const name of ['Kepengurusan','Keuangan','Akun & bantuan']){
  await expect(menu.getByText(name,{exact:true})).toBeVisible()
 }
 await expect(menu.getByRole('link',{name:'Audit'})).toBeVisible()
 await expect(menu.getByRole('link',{name:'Buku kas'})).toBeVisible()
 await menu.getByRole('link',{name:'Audit'}).click()
 await expect(menu).not.toHaveAttribute('open','')
 await expect(page.getByRole('heading',{name:'Audit sistem'})).toBeVisible()
 await expect(page.locator('.drawer-overlay')).toHaveCount(0)
})
test('Glass preferences and light/dark keep staff controls usable',async({page})=>{
 test.setTimeout(90000)
 await asRole(page,/Hana Putri/)
 await page.setViewportSize({width:390,height:844})
 await page.goto(at('/app/pengaturan'))
 const slider=page.locator('#glass-blur')
 await slider.focus();await slider.press('End')
 await expect(slider).toHaveValue('28')
 await page.goto(at('/pengurus/verifikasi'))
 await page.getByRole('button',{name:'Ganti ke mode gelap'}).click()
 await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.theme)).toBe('dark')
 for(const route of ['/pengurus/verifikasi','/pengurus/buku-kas','/pengurus/anggota','/pengurus/laporan']){
  await checkFit(page,route,390)
  await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.theme)).toBe('dark')
 }
 await page.getByRole('button',{name:'Ganti ke mode terang'}).click()
 await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.theme)).toBe('light')
})
test('Chair mobile: approvals, policy changes and role review controls remain reachable',async({page})=>{
 test.setTimeout(90000)
 await asRole(page,/Kirana Laras/)
 await page.setViewportSize({width:320,height:740})
 await page.goto(at('/pengurus/persetujuan'))
 await expect(page.getByRole('heading',{name:'Persetujuan'})).toBeVisible()
 await page.goto(at('/pengurus/periode'))
 const disclosure=page.getByText('Lihat prosedur serah terima')
 await expect(disclosure).toBeVisible()
 await disclosure.click()
 await expect(page.getByText(/Cocokkan saldo/)).toBeVisible()
 await page.goto(at('/pengurus/akses'))
 await expect(page.getByText('Pengelolaan hak akses')).toBeVisible()
 await expect(page.getByRole('textbox',{name:'Cari role'})).toBeVisible()
 await page.goto(at('/pengurus/kebijakan'))
 await expect(page.getByRole('button',{name:/Ajukan rancangan/})).toBeVisible()
})
