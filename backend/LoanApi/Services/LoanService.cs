// Services/LoanService.cs
// Uses the Firebase Admin SDK (Google.Cloud.Firestore) to persist loans.
// Install the package:  dotnet add package Google.Cloud.Firestore

using Google.Cloud.Firestore;
using LoanApi.DTOs;
using LoanApi.Models;

namespace LoanApi.Services;

public interface ILoanService
{
    Task<Loan> CreateLoanAsync(CreateLoanDto dto);
    Task<IEnumerable<Loan>> GetLoansByUserAsync(string userId);
    Task<Loan?> GetLoanByIdAsync(string id);
    Task<Loan?> UpdateLoanAsync(string id, UpdateLoanDto dto);
    Task<bool> DeleteLoanAsync(string id);
}

public class LoanService : ILoanService
{
    private readonly FirestoreDb _db;
    private const string Collection = "loans";

    public LoanService(IConfiguration config)
    {
        var projectId = config["Firebase:ProjectId"]
            ?? throw new InvalidOperationException("Firebase:ProjectId is not configured.");

        var credentialPath = config["Firebase:CredentialPath"]
            ?? throw new InvalidOperationException("Firebase:CredentialPath is not configured.");

        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);
        _db = FirestoreDb.Create(projectId);
    }

    // ── Create ────────────────────────────────────────────────────────────────
    public async Task<Loan> CreateLoanAsync(CreateLoanDto dto)
    {
        var loan = new Loan
        {
            UserId = dto.UserId,
            UserEmail = dto.UserEmail,
            LoanAmount = dto.LoanAmount,
            LoanPurpose = dto.LoanPurpose,
            LoanTerm = dto.LoanTerm,
            LoanTermUnit = dto.LoanTermUnit,
        };

        var docRef = await _db.Collection(Collection).AddAsync(new Dictionary<string, object>
        {
            ["id"] = loan.Id,
            ["userId"] = loan.UserId,
            ["userEmail"] = loan.UserEmail,
            ["loanAmount"] = (double)loan.LoanAmount,
            ["loanPurpose"] = loan.LoanPurpose,
            ["loanTerm"] = loan.LoanTerm,
            ["loanTermUnit"] = loan.LoanTermUnit,
            ["status"] = loan.Status,
            ["createdAt"] = Timestamp.FromDateTime(loan.CreatedAt),
        });

        // Store the Firestore document ID so we can reference it later
        loan.Id = docRef.Id;
        await docRef.UpdateAsync("id", docRef.Id);

        return loan;
    }

    // ── Read (by user) ────────────────────────────────────────────────────────
    public async Task<IEnumerable<Loan>> GetLoansByUserAsync(string userId)
    {
        var query = _db.Collection(Collection).WhereEqualTo("userId", userId);
        var snapshot = await query.GetSnapshotAsync();

        return snapshot.Documents
            .Select(DocToLoan)
            .OrderByDescending(l => l.CreatedAt);
    }

    // ── Read (by id) ──────────────────────────────────────────────────────────
    public async Task<Loan?> GetLoanByIdAsync(string id)
    {
        var doc = await _db.Collection(Collection).Document(id).GetSnapshotAsync();
        return doc.Exists ? DocToLoan(doc) : null;
    }

    // ── Update ────────────────────────────────────────────────────────────────
    public async Task<Loan?> UpdateLoanAsync(string id, UpdateLoanDto dto)
    {
        var docRef = _db.Collection(Collection).Document(id);
        var snap = await docRef.GetSnapshotAsync();
        if (!snap.Exists) return null;

        var updates = new Dictionary<string, object>();
        if (dto.LoanAmount.HasValue) updates["loanAmount"] = (double)dto.LoanAmount.Value;
        if (dto.LoanPurpose != null) updates["loanPurpose"] = dto.LoanPurpose;
        if (dto.LoanTerm.HasValue) updates["loanTerm"] = dto.LoanTerm.Value;
        if (dto.LoanTermUnit != null) updates["loanTermUnit"] = dto.LoanTermUnit;
        if (dto.Status != null) updates["status"] = dto.Status;

        if (updates.Count > 0)
            await docRef.UpdateAsync(updates);

        var updated = await docRef.GetSnapshotAsync();
        return DocToLoan(updated);
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    public async Task<bool> DeleteLoanAsync(string id)
    {
        var docRef = _db.Collection(Collection).Document(id);
        var snap = await docRef.GetSnapshotAsync();
        if (!snap.Exists) return false;

        await docRef.DeleteAsync();
        return true;
    }

    // ── Helper: Firestore document → Loan model ───────────────────────────────
    private static Loan DocToLoan(DocumentSnapshot doc) => new()
    {
        Id = doc.Id,
        UserId = doc.GetValue<string>("userId"),
        UserEmail = doc.GetValue<string>("userEmail"),
        LoanAmount = (decimal)doc.GetValue<double>("loanAmount"),
        LoanPurpose = doc.GetValue<string>("loanPurpose"),
        LoanTerm = doc.GetValue<int>("loanTerm"),
        LoanTermUnit = doc.GetValue<string>("loanTermUnit"),
        Status = doc.GetValue<string>("status"),
        CreatedAt = doc.GetValue<Timestamp>("createdAt").ToDateTime(),
    };
}