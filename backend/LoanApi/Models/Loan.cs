// Models/Loan.cs
namespace LoanApi.Models;

public class Loan
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public decimal LoanAmount { get; set; }
    public string LoanPurpose { get; set; } = string.Empty;
    public int LoanTerm { get; set; }
    public string LoanTermUnit { get; set; } = "months";
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
