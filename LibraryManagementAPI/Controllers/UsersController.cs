using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LibraryManagementAPI.Data;
using LibraryManagementAPI.Models;
using LibraryManagementAPI.DTOs;
using AutoMapper;

namespace LibraryManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IMapper _mapper;
        
        public UsersController(LibraryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        [HttpGet]
        public ActionResult<IEnumerable<UserDto>> GetUsers()
        {
            try
            {
                var users = _context.Users.OrderBy(u => u.Username).ToList();
                var userDtos = _mapper.Map<List<UserDto>>(users);
                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users", error = ex.Message });
            }
        }
        
        [HttpGet("{id}")]
        public ActionResult<UserDto> GetUser(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }
                
                var userDto = _mapper.Map<UserDto>(user);
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the user", error = ex.Message });
            }
        }
        
        [HttpPost]
        public ActionResult<UserDto> CreateUser(CreateUserDto createUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                // Check if username already exists
                if (_context.Users.Any(u => u.Username == createUserDto.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }
                
                var user = _mapper.Map<User>(createUserDto);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);
                
                _context.Users.Add(user);
                _context.SaveChanges();
                
                var userDto = _mapper.Map<UserDto>(user);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the user", error = ex.Message });
            }
        }
        
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                var existingUser = _context.Users.Find(id);
                if (existingUser == null)
                {
                    return NotFound(new { message = "User not found" });
                }
                
                // Check if username already exists for another user
                if (_context.Users.Any(u => u.Username == updateUserDto.Username && u.Id != id))
                {
                    return BadRequest(new { message = "Username already exists" });
                }
                
                _mapper.Map(updateUserDto, existingUser);
                
                if (!string.IsNullOrEmpty(updateUserDto.Password))
                {
                    existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);
                }
                
                _context.SaveChanges();
                
                var userDto = _mapper.Map<UserDto>(existingUser);
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the user", error = ex.Message });
            }
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }
                
                // Prevent deletion of the last admin user
                if (user.Role == "Admin" && _context.Users.Count(u => u.Role == "Admin") <= 1)
                {
                    return BadRequest(new { message = "Cannot delete the last admin user" });
                }
                
                _context.Users.Remove(user);
                _context.SaveChanges();
                
                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the user", error = ex.Message });
            }
        }
    }
}

