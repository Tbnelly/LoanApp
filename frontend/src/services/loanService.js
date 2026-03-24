const API_BASE = import.meta.env.VITE_API_BASE_URL 

// ── Submit a new loan application ────────────────────────────────────────────
export async function saveLoanToFirestore(userId, userEmail, loanData) {
  const res = await fetch(`${API_BASE}/api/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      userEmail,
      loanAmount:   loanData.loanAmount,
      loanPurpose:  loanData.loanPurpose,
      loanTerm:     loanData.loanTerm,
      loanTermUnit: loanData.loanTermUnit,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }

  const created = await res.json()
  return created.id
}

// ── Fetch all loans for a user ────────────────────────────────────────────────
export async function getUserLoans(userId) {
  const res = await fetch(`${API_BASE}/api/loans/${userId}`)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }

  return res.json() // returns array of loan objects
}

// ── Delete a loan ─────────────────────────────────────────────────────────────
export async function deleteLoan(loanId) {
  const res = await fetch(`${API_BASE}/api/loans/${loanId}`, {
    method: 'DELETE',
  })

  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }
}