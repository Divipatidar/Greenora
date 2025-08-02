package com.cdac.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SignInDto {
	
	 @NotBlank(message = "Email is required")
	 @Email(message = "Invalid email format")
     private String email;

	 @NotBlank(message = "Password is required")
	 private String password;
}
