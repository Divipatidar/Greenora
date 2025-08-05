package com.cdac.dto;

import com.cdac.entities.StockStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProductDto {
	
	@NotBlank(message = "Product name is required")
     
	 @Size(max = 1000, message = "Description must not exceed 1000 characters")private String name;
	
    private String description;
	
    @Min(value = 0, message = "Quantity cannot be negative")
	private int quantity;
	
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
	private double price;
	
	
	private String image ;
    @NotNull(message = "Category ID is required")

	private Long categoryId;
	
	@NotNull(message = "Vendor ID is required")
	private Long vendorId;
	
	@Min(value = 1, message = "Eco rating must be between 1 and 5")
    @Max(value = 5, message = "Eco rating must be between 1 and 5")
	private int ecoRating;
	
	
	private boolean isActive;
	
	 @NotNull(message = "Stock status is required")
	private StockStatus stockStatus;
}
