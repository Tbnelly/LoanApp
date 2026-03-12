// src/services/loanService.js
import {
  collection, addDoc, getDocs, updateDoc,
  query, where, serverTimestamp, doc, deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'

const LOANS_COLLECTION = 'loans'

// ── Save a new loan to Firestore ──────────────────────────────────────────────
// After saving, we simulate an auto-approval after 10 seconds.
// In a real app, a bank admin would manually change the status.
export async function saveLoanToFirestore(userId, userEmail, loanData) {
  const docRef = await addDoc(collection(db, LOANS_COLLECTION), {
    userId,
    userEmail,
    loanAmount:   loanData.loanAmount,
    loanPurpose:  loanData.loanPurpose,
    loanTerm:     loanData.loanTerm,
    loanTermUnit: loanData.loanTermUnit,
    status:       'pending',
    createdAt:    serverTimestamp(),
  })

  // ── Simulate auto-approval after 10 seconds (for demo purposes) ──
  // Remove this setTimeout in a real production app.
  setTimeout(async () => {
    try {
      await updateDoc(doc(db, LOANS_COLLECTION, docRef.id), {
        status: 'approved'
      })
      console.log('✅ Loan auto-approved:', docRef.id)
    } catch (err) {
      console.warn('Could not auto-approve loan:', err.message)
    }
  }, 10000) // 10 seconds

  return docRef.id
}

// ── Get all loans for a user ──────────────────────────────────────────────────
export async function getUserLoans(userId) {
  const q = query(
    collection(db, LOANS_COLLECTION),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(q)
  const loans = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))

  // Sort newest first (client-side — avoids needing a Firestore index)
  loans.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() ?? new Date(0)
    const dateB = b.createdAt?.toDate?.() ?? new Date(0)
    return dateB - dateA
  })

  return loans
}

// ── Delete a loan ─────────────────────────────────────────────────────────────
export async function deleteLoan(loanId) {
  await deleteDoc(doc(db, LOANS_COLLECTION, loanId))
}