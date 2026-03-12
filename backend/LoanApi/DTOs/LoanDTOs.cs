// DTOs/LoanDTOs.cs
namespace LoanApi.DTOs;

public record CreateLoanDto(
    string UserId,
    string UserEmail,
    decimal LoanAmount,
    string LoanPurpose,
    int LoanTerm,
    string LoanTermUnit
);

public record UpdateLoanDto(
    decimal? LoanAmount,
    string? LoanPurpose,
    int? LoanTerm,
    string? LoanTermUnit,
    string? Status
);
