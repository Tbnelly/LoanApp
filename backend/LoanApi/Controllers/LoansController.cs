// Controllers/LoansController.cs
using LoanApi.DTOs;
using LoanApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace LoanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly ILoanService _loanService;

    public LoansController(ILoanService loanService)
    {
        _loanService = loanService;
    }

    // POST /api/loans
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLoanDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserId))
            return BadRequest(new { error = "UserId is required." });

        if (dto.LoanAmount <= 0)
            return BadRequest(new { error = "Loan amount must be greater than 0." });

        var loan = await _loanService.CreateLoanAsync(dto);
        return CreatedAtAction(nameof(GetByUser), new { userId = loan.UserId }, loan);
    }

    // GET /api/loans/{userId}
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetByUser(string userId)
    {
        var loans = await _loanService.GetLoansByUserAsync(userId);
        return Ok(loans);
    }

    // PUT /api/loans/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateLoanDto dto)
    {
        var updated = await _loanService.UpdateLoanAsync(id, dto);
        if (updated is null) return NotFound(new { error = "Loan not found." });
        return Ok(updated);
    }

    // DELETE /api/loans/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _loanService.DeleteLoanAsync(id);
        if (!deleted) return NotFound(new { error = "Loan not found." });
        return NoContent();
    }
}
