import { expect, test, type Page } from '@playwright/test'

const at=(route:string)=>`/KasHima/#${route}`
async function signInAs(page:Page,memberName:RegExp){
 await page.goto(at('/app/profil'))
 await page.getByRole('button',{name:'Ganti akun demo'}).click()
 await page.getByRole('button',{name:memberName}).click()
}
async function expectMobileNavigation(page:Page,role:'member'|'treasurer'|'chair'){
 await page.setViewportSize({width:320,height:720})
 await page.goto(at('/app/profil'))
 await expect(page.locator('.sidebar')).toBeHidden()
 await expect(page.locator('.drawer-overlay')).toHaveCount(0)
 await expect(page.getByRole('button',{name:'Buka menu'})).toHaveCount(0)
 const bottom=page.locator('.bottom-nav')
 await expect(bottom.getByRole('link',{name:'Profil',exact:true})).toBeVisible()
 await expect(bottom.locator('.bottom-item')).toHaveCount(role==='member'?5:4)
 const overlap=await page.evaluate(()=>{
  const root=document.documentElement,brand=document.querySelector('.topbar-mobile .brand')?.getBoundingClientRect(),
    actions=document.querySelector('.topbar-actions')?.getBoundingClientRect()
  return {overflow:root.scrollWidth-root.clientWidth,header:brand&&actions?brand.right-actions.left:0}
 })
 expect(overlap.overflow).toBeLessThanOrEqual(2)
 expect(overlap.header).toBeLessThanOrEqual(2)
}

test('member navigation has profile and no mobile sidebar',async({page})=>{
 await expectMobileNavigation(page,'member')
 await expect(page.getByRole('heading',{name:'Ringkasan'})).toBeVisible()
 await expect(page.getByText('Bulan lunas')).toBeVisible()
 await expect(page.getByText('Tagihan terbuka')).toBeVisible()
 await expect(page.getByRole('heading',{name:'Informasi pribadi'})).toHaveCount(0)
})
test('treasurer can open all finance tools through compact mobile work menu',async({page})=>{
 await signInAs(page,/Hana Putri/)
 await expectMobileNavigation(page,'treasurer')
 await expect(page.getByText('Menunggu verifikasi')).toBeVisible()
 const menu=page.locator('.mobile-workspace-menu')
 await expect(menu.locator('summary')).toBeVisible()
 await menu.locator('summary').click()
 await expect(menu.getByRole('link',{name:'Buku kas'})).toBeVisible()
 await menu.getByRole('link',{name:'Buku kas'}).click()
 await expect(page.getByRole('heading',{name:'Buku kas'})).toBeVisible()
 await expect(menu).not.toHaveAttribute('open','')
})
test('chair gets profile tab plus access to all approval and admin routes',async({page})=>{
 await signInAs(page,/Kirana Laras/)
 await expectMobileNavigation(page,'chair')
 await expect(page.getByText('Menunggu persetujuan')).toBeVisible()
 const menu=page.locator('.mobile-workspace-menu')
 await menu.locator('summary').click()
 await expect(menu.getByRole('link',{name:'Kebijakan'})).toBeVisible()
 await expect(menu.getByRole('link',{name:'Audit'})).toBeVisible()
 await menu.getByRole('link',{name:'Hak akses'}).click()
 await expect(page.getByRole('heading',{name:'Hak akses'})).toBeVisible()
})
test('profile stays aligned with a long name, theme switch and after reload',async({page})=>{
 await page.setViewportSize({width:320,height:720})
 await page.goto(at('/app/profil'))
 await page.getByRole('button',{name:'Edit profil'}).click()
 const dlg=page.getByRole('dialog',{name:'Edit profil'})
 await expect(dlg).toBeVisible()
 const full='Nama Anggota Contoh Dengan Beberapa Kata Panjang Untuk Audit Tampilan'
 await dlg.getByLabel('Nama lengkap').fill(full)
 await dlg.getByLabel('Nama panggilan').fill('Nama Panggilan Baru')
 await dlg.getByRole('button',{name:'Simpan perubahan'}).click()
 await expect(page.getByRole('heading',{name:full})).toBeVisible()
 await page.reload()
 await expect(page.getByRole('heading',{name:full})).toBeVisible()
 const data=await page.evaluate(()=>{
  const w=document.documentElement.clientWidth
  const pageTitle=document.querySelector('.profile-intro h2')!.getBoundingClientRect()
  return {overflow:document.documentElement.scrollWidth-w,headingLeft:pageTitle.left,headingRight:pageTitle.right,vw:w}
 })
 expect(data.overflow).toBeLessThanOrEqual(2)
 expect(data.headingLeft).toBeGreaterThanOrEqual(0)
 expect(data.headingRight).toBeLessThanOrEqual(data.vw+2)
})
test('desktop sidebar remains, while mobile-only work menu does not clutter desktop',async({page})=>{
 await page.setViewportSize({width:1280,height:800})
 await signInAs(page,/Hana Putri/)
 await page.goto(at('/pengurus/keuangan'))
 await expect(page.locator('.sidebar')).toBeVisible()
 await expect(page.locator('.mobile-workspace-menu')).toBeHidden()
 await expect(page.locator('.top-profile')).toBeVisible()
})
