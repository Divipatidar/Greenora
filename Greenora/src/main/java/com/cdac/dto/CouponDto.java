package com.cdac.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class CouponDto {
     
	private String couponCode;
	
	private double discountValue;
	
	private double minOrderAmt;
	
	private boolean isActive;
	
	private LocalDate validFrom;
	
	private LocalDate validUntil;
}
