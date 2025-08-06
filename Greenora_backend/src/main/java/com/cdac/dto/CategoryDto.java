package com.cdac.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class CategoryDto  {
    @NotBlank(message = "Category name is required")

	private String name;
    
    @NotBlank(message = "Description must not exceed 255 characters")
		private String description;
	
}
