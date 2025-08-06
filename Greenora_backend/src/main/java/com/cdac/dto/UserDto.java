package com.cdac.dto;

import com.cdac.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDto {
	
	
	
	
	    private Long id;
	 @NotBlank(message = "Name is required")
	    @Size(max = 100, message = "Name must not exceed 100 characters")
	private String name;
	   
	
	 @NotBlank(message = "Email is required")
	    @Email(message = "Invalid email format")
	private String email;
	
	
//	 @NotBlank(message = "Password is required")
//	    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
//	private String password;
	
	 @NotBlank(message = "Phone number is required")
	  @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
	
	private String phone;
	 private Long addresId;
	
	private UserRole role;
} 