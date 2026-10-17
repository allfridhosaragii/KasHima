import { test, expect } from '@playwright/test'
const url=(route:string)=>'/KasHima/#'+route
async function fit(page:import('@playwright/test').Page){const out=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(out).toBeLessThanOrEqual(2)}
test('Anggota: routes aurora glass dan diagram pembayaran',async({page})=>{
 await page.goto(url('/app'));await expect(page.getByLabel('Perjalanan pembayaran')).toBeVisible()
 for(const path of ['/app','/app/tagihan','/app/leaderboard','/app/riwayat','/app/profil','/app/pengaturan','/app/notifikasi','/app/bantuan']){
  await page.goto(url(path));await expect(page.locator('#main')).toBeVisible();await fit(page)
 }
})
test('Bendahara: cobalt workspace & 10 halaman kerja',async({page})=>{
 await page.goto(url('/app/profil'));await page.getByRole('button',{name:'Ganti akun demo'}).click();await page.getByRole('button',{name:/Hana Putri/}).click()
 await expect(page.locator('html')).toHaveAttribute('data-workspace','treasurer')
 await expect(page.getByLabel('Alur verifikasi kas')).toBeVisible()
 for(const path of ['/pengurus/keuangan','/pengurus/verifikasi','/pengurus/verifikasi/PAY-DEMO-001','/pengurus/anggota','/pengurus/anggota/u7','/pengurus/tunggakan','/pengurus/reminder','/pengurus/buku-kas','/pengurus/laporan','/pengurus/sengketa']){
  await page.goto(url(path));await expect(page.locator('#main')).toBeVisible();await fit(page)
 }
})
test('Kahima: orchid workspace & seluruh halaman administrasi',async({page})=>{
 await page.goto(url('/app/profil'));await page.getByRole('button',{name:'Ganti akun demo'}).click();await page.getByRole('button',{name:/Kirana Laras/}).click()
 await expect(page.locator('html')).toHaveAttribute('data-workspace','chair')
 for(const path of ['/pengurus/persetujuan','/pengurus/periode','/pengurus/keanggotaan','/pengurus/kebijakan','/pengurus/akses','/pengurus/audit']){
  await page.goto(url(path));await expect(page.locator('#main')).toBeVisible();await fit(page)
 }
 await page.goto(url('/pengurus/persetujuan'));await expect(page.getByLabel('Alur persetujuan')).toBeVisible()
})
test('Glass Studio slider masih mengubah blur & tersimpan',async({page})=>{
 await page.goto(url('/app/pengaturan'));const slider=page.locator('#glass-blur')
 await slider.focus();await slider.press('Home');await expect(slider).toHaveValue('0')
 await expect.poll(()=>page.evaluate(()=>document.documentElement.style.getPropertyValue('--glass-blur'))).toBe('0px')
 await slider.press('End');await expect(slider).toHaveValue('28')
 await expect.poll(()=>page.evaluate(()=>document.documentElement.style.getPropertyValue('--glass-blur'))).toBe('28px')
 await page.reload();await expect(slider).toHaveValue('28')
})
