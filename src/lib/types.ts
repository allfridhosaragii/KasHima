export type Role = 'member' | 'treasurer' | 'chair'
export type MemberStatus = 'active' | 'leave' | 'inactive' | 'alumni'
export type Theme = 'light' | 'dark'
export type GlassPreset = 'solid' | 'satin' | 'frost' | 'crystal'
export type PaymentStatus = 'pending' | 'verified' | 'rejected'
export interface User {
  id: string
  nim: string
  name: string
  nickname: string
  year: string
  role: Role
  status: MemberStatus
  avatar?: string
  phone?: string
  theme: Theme
  glass: GlassPreset
  blur: number
  notify: boolean
}
export interface Obligation { id: string; userId: string; month: string; base: number; fine: number; status: 'due' | 'paid' | 'waived' }
export interface Payment {
  id: string; userId: string; obligationIds: string[]; amount: number; status: 'verified'; paidAt: string; reference: string
}
export interface PaymentIntent { id: string; userId: string; obligationIds: string[]; amount: number; status: PaymentStatus; createdAt: string; verifiedAt?: string; reference?: string }
export interface Notice { id: string; userId: string; title: string; body: string; read: boolean; date: string }
export interface Ticket { id: string; userId: string; title: string; message: string; status: 'open' | 'resolved'; date: string }
export interface Expense { id: string; title: string; amount: number; date: string; status: 'pending' | 'approved' | 'rejected'; by: string }
export interface Proposal { id: string; title: string; detail: string; amount: number; status: 'submitted' | 'approved' | 'rejected'; by: string; date: string }
export interface Audit { id: string; text: string; by: string; date: string }
export interface StoreState {
  users: User[]; obligations: Obligation[]; payments: Payment[]; intents: PaymentIntent[]; notices: Notice[];
  tickets: Ticket[]; expenses: Expense[]; proposals: Proposal[]; audit: Audit[];
  currentUserId: string | null; period: string; duesFee: number; fineFee: number
}
