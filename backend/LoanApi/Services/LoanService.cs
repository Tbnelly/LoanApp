// Services/LoanService.cs
// NOTE: This uses an in-memory store for simplicity.
// In production, replace with a real database (e.g., EF Core + SQL Server or Firestore Admin SDK).
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
    private static readonly List<Loan> _loans = new(); // Replace with real DB

    public Task<Loan> CreateLoanAsync(CreateLoanDto dto)
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
        _loans.Add(loan);
        return Task.FromResult(loan);
    }

    public Task<IEnumerable<Loan>> GetLoansByUserAsync(string userId)
    {
        var result = _loans.Where(l => l.UserId == userId).OrderByDescending(l => l.CreatedAt);
        return Task.FromResult<IEnumerable<Loan>>(result);
    }

    public Task<Loan?> GetLoanByIdAsync(string id)
    {
        return Task.FromResult(_loans.FirstOrDefault(l => l.Id == id));
    }

    public Task<Loan?> UpdateLoanAsync(string id, UpdateLoanDto dto)
    {
        var loan = _loans.FirstOrDefault(l => l.Id == id);
        if (loan is null) return Task.FromResult<Loan?>(null);

        if (dto.LoanAmount.HasValue) loan.LoanAmount = dto.LoanAmount.Value;
        if (dto.LoanPurpose is not null) loan.LoanPurpose = dto.LoanPurpose;
        if (dto.LoanTerm.HasValue) loan.LoanTerm = dto.LoanTerm.Value;
        if (dto.LoanTermUnit is not null) loan.LoanTermUnit = dto.LoanTermUnit;
        if (dto.Status is not null) loan.Status = dto.Status;

        return Task.FromResult<Loan?>(loan);
    }

    public Task<bool> DeleteLoanAsync(string id)
    {
        var loan = _loans.FirstOrDefault(l => l.Id == id);
        if (loan is null) return Task.FromResult(false);
        _loans.Remove(loan);
        return Task.FromResult(true);
    }
}
