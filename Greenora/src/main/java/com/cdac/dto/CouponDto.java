package com.cdac.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class CouponDto {
     
	@NotBlank(message = "Coupon code is required")
	private String couponCode;
	
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than 0")
	private double discountValue;
	
    @DecimalMin(value = "0.0", inclusive = true, message = "Minimum order amount must be 0 or greater")
	private double minOrderAmt;
	
    
	private boolean isActive;
	
	@NotNull(message = "Valid from date is required")
	private LocalDate validFrom;
	
	@NotNull(message = "Valid until date is required")
    @Future(message = "Valid until date must be in the future")
	private LocalDate validUntil;
}
