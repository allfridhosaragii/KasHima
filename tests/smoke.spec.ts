import { test, expect } from '@playwright/test'

const url = (part = '/app') => `/KasHima/#${part}`

test.beforeEach(async ({ page }) => {
 await page.goto(url())
 await page.waitForLoadState('domcontentloaded')
})

test('profile is clean and account status is shown, without removed labels',async({page})=>{
 await page.goto(url('/app/profil'))
 await expect(page.getByRole('heading',{name:'Profil'})).toBeVisible()
 await expect(page.getByRole('heading',{name:'Raka Pratama'})).toBeVisible()
 await expect(page.getByText('Akun aktif')).toBeVisible()
 await expect(page.getByText('MODE PRATINJAU')).toHaveCount(0)
 await expect(page.getByText('01 / IDENTITAS')).toHaveCount(0)
 await expect(page.getByRole('heading',{name:'Informasi pribadi'})).toHaveCount(0)
 await expect(page.getByRole('heading',{name:'Ringkasan'})).toBeVisible()
})

test('Glass Studio slider updates actual blur and persists for current demo account',async({page})=>{
 await page.goto(url('/app/pengaturan'))
 await expect(page.getByRole('heading',{name:'Pengaturan'})).toBeVisible()
 await expect(page.getByText('Glass Studio')).toBeVisible()
 const range=page.locator('#glass-blur')
 await range.focus()
 await range.press('End')
 await expect(range).toHaveValue('28')
 await expect.poll(()=>page.evaluate(()=>document.documentElement.style.getPropertyValue('--glass-blur'))).toBe('28px')
 await page.reload()
 await expect(range).toHaveValue('28')
 await expect(page.getByText('AKUN AKTIF')).toHaveCount(0)
})

test('profile editor saves nickname and name; logout returns to demo sign in',async({page})=>{
 await page.goto(url('/app/profil'))
 await page.getByRole('button',{name:'Edit profil'}).click()
 await page.getByLabel('Nama lengkap').fill('Raka Prima Wijaya')
 await page.getByLabel('Nama panggilan').fill('Raka P')
 await page.getByRole('button',{name:'Simpan perubahan'}).click()
 await expect(page.getByRole('heading',{name:'Raka Prima Wijaya'})).toBeVisible()
 await page.getByRole('button',{name:'Keluar dari akun'}).click()
 await page.getByRole('button',{name:'Keluar',exact:true}).click()
 await expect(page.getByRole('heading',{name:/Selamat datang/})).toBeVisible()
})

test('chair can change another member type and audit the change',async({page})=>{
 await page.goto(url('/app/profil'))
 await page.getByRole('button',{name:'Ganti akun demo'}).click()
 await page.getByRole('button',{name:/Kirana Laras/}).click()
 await page.goto(url('/pengurus/akses'))
 await expect(page.getByRole('heading',{name:'Hak akses'})).toBeVisible()
 const row=page.locator('.role-row').filter({hasText:'Raka Pratama'})
 await row.getByRole('combobox').selectOption('treasurer')
 await row.getByRole('button',{name:'Terapkan'}).click()
 await page.getByRole('button',{name:'Konfirmasi perubahan'}).click()
 await expect(row.getByRole('combobox')).toHaveValue('treasurer')
 await page.goto(url('/pengurus/audit'))
 await expect(page.getByText(/Peran Raka Pratama/)).toBeVisible()
})

test('unverified payment cannot be opened as success receipt',async({page})=>{
 await page.goto(url('/app/tagihan'))
 const pay=page.getByRole('button',{name:/Bayar Rp/}).first()
 await pay.click()
 await expect(page.getByRole('heading',{name:'Bayar kas'})).toBeVisible()
 const location=page.url().match(/\/app\/bayar\/([^/#?]+)/)
 expect(location).toBeTruthy()
 await page.goto(url(`/app/bayar/${location?.[1]}/berhasil`))
 await expect(page.getByRole('heading',{name:'Belum terverifikasi'})).toBeVisible()
 await expect(page.getByText('BUKTI SIMULASI')).toHaveCount(0)
})

test('mobile and desktop layouts have no global horizontal overflow',async({page})=>{
 for(const path of ['/app','/app/profil','/app/pengaturan','/app/leaderboard']){
  await page.goto(url(path))
  await expect(page.locator('main#main')).toBeVisible()
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
  if(overflow>2){
   const offenders=await page.evaluate(()=>Array.from(document.querySelectorAll<HTMLElement>('*')).map(e=>({tag:e.tagName,cl:typeof e.className==='string'?e.className:'',right:Math.round(e.getBoundingClientRect().right),left:Math.round(e.getBoundingClientRect().left),width:Math.round(e.getBoundingClientRect().width)})).filter(e=>e.right>window.innerWidth+2||e.left< -2).slice(0,16))
   console.log(`Overflow details on ${path}: ${JSON.stringify(offenders)}`)
  }
  expect(overflow,`overflow on ${path}`).toBeLessThanOrEqual(2)
 }
})


test('private-information panel is removed for all role profiles', async ({ page }) => {
 for (const role of [null, /Hana Putri/, /Kirana Laras/]) {
  await page.goto(url('/app/profil'))
  if (role) {
   await page.getByRole('button', { name: 'Ganti akun demo' }).click()
   await page.getByRole('button', { name: role }).click()
  }
  await page.goto(url('/app/profil'))
  await expect(page.getByRole('heading', { name: 'Informasi pribadi' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Ringkasan' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit profil' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Keluar dari akun' })).toBeVisible()
 }
})
