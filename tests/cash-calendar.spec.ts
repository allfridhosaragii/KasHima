import {expect,test,type Page} from '@playwright/test'
const pageUrl=(route:string)=>'/KasHima/#'+route
async function asRole(page:Page,name:RegExp){
 await page.goto(pageUrl('/app/profil'))
 await page.getByRole('button',{name:'Ganti akun demo'}).click()
 await page.getByRole('button',{name}).click()
}
test('Treasurer cash calendar defaults to current WIB day and navigates months',async({page})=>{
 await asRole(page,/Hana Putri/)
 await page.goto(pageUrl('/pengurus/buku-kas'))
 await expect(page.getByRole('heading',{name:'Kalender Kas'})).toBeVisible()
 await expect(page.locator('.ck-grid')).toBeVisible()
 await expect(page.locator('.ck-grid button.selected')).toHaveCount(1)
 await page.getByRole('button',{name:'Bulan sebelumnya'}).click()
 await expect(page.locator('.ck-grid')).toBeVisible()
 await page.getByRole('button',{name:'Hari ini',exact:true}).click()
 await expect(page.locator('.ck-grid button.selected')).toHaveCount(1)
 await expect(page.getByText('Total diterima')).toBeVisible()
})
test('Daily breakdown, types, searching and list mode remain functional',async({page})=>{
 await asRole(page,/Hana Putri/)
 await page.goto(pageUrl('/pengurus/buku-kas'))
 await page.locator('input[type=month]').fill('2026-10')
 await page.locator('.ck-grid').getByRole('button',{name:/^5 Oktober 2026/}).click()
 await expect(page.getByRole('heading',{name:'5 Oktober 2026'})).toBeVisible()
 await expect(page.getByText('Pokok tunggakan')).toBeVisible()
 await expect(page.locator('.ck-list')).toBeVisible()
 await page.getByRole('button',{name:'Daftar',exact:true}).click()
 await expect(page.getByRole('heading',{name:'Aktivitas bulanan'})).toBeVisible()
 await page.getByRole('button',{name:'Perlu diperiksa',exact:true}).click()
 await expect(page.locator('.ck-list')).toBeVisible()
 await page.getByRole('button',{name:'Semua',exact:true}).click()
 await page.getByRole('searchbox',{name:'Cari anggota atau referensi'}).fill('Nadia')
 await expect(page.locator('.ck-row').first()).toBeVisible()
})
test('Calendar remains within viewport at mobile through desktop widths in light and dark',async({page})=>{
 test.setTimeout(180000)
 await asRole(page,/Hana Putri/)
 for(const mode of ['light','dark']){
  if(mode==='dark'){
   await page.goto(pageUrl('/app/pengaturan'))
   await page.getByRole('switch',{name:'Mode gelap'}).click()
  }
  await page.goto(pageUrl('/pengurus/buku-kas'))
  for(const width of [320,344,360,375,390,414,430,600,768,850,851,1024,1280,1440]){
   await page.setViewportSize({width,height:780})
   const result=await page.evaluate(()=>{
    const vw=document.documentElement.clientWidth
    const off=[...document.querySelectorAll<HTMLElement>('.ck-root,.ck-panel,.ck-grid,.ck-month-total,.ck-list,.ck-list-head,.ck-month-control')]
     .filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&(r.left<-2||r.right>vw+2)})
     .map(x=>x.className)
    const target=document.querySelector<HTMLElement>('.ck-grid button')?.getBoundingClientRect().height||0
    return {overflow:document.documentElement.scrollWidth-vw,off,target}
   })
   expect(result.overflow,mode+' '+width+' '+JSON.stringify(result)).toBeLessThanOrEqual(2)
   expect(result.off,mode+' '+width).toEqual([])
   expect(result.target,mode+' '+width).toBeGreaterThanOrEqual(43)
  }
 }
})
test('Member cannot access financial calendar, chair can read without expense action',async({page})=>{
 await page.goto(pageUrl('/pengurus/buku-kas'))
 await expect(page.getByText(/hanya bisa diakses melalui akun pengurus/i)).toBeVisible()
 await asRole(page,/Kirana Laras/)
 await page.goto(pageUrl('/pengurus/buku-kas'))
 await expect(page.getByRole('heading',{name:'Kalender Kas'})).toBeVisible()
 await expect(page.getByRole('button',{name:'Ajukan pengeluaran'})).toHaveCount(0)
})
test('Treasurer can still submit expense and calendar respects glass settings',async({page})=>{
 await asRole(page,/Hana Putri/)
 await page.goto(pageUrl('/app/pengaturan'))
 const blur=page.locator('#glass-blur')
 await blur.focus();await blur.press('End')
 await expect(blur).toHaveValue('28')
 await page.goto(pageUrl('/pengurus/buku-kas'))
 await page.getByRole('button',{name:'Ajukan pengeluaran'}).click()
 const modal=page.getByRole('dialog',{name:'Ajukan pengeluaran'})
 await expect(modal).toBeVisible()
 await modal.getByLabel('Keperluan').fill('Konsumsi rapat organisasi')
 await modal.getByLabel('Nominal (rupiah)').fill('45000')
 await modal.getByRole('button',{name:'Ajukan ke Kahima'}).click()
 await expect(modal).toHaveCount(0)
 await page.getByRole('button',{name:'Daftar',exact:true}).click()
 await expect(page.locator('.ck-list')).toBeVisible()
})
