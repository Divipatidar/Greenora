package com.cdac.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Coupon  extends BaseEntity{
	@Column(name = "coupon_code",length = 20)
   private String couponCode;
	
	@Column(name = "discount_value")
	private double discountValue;
	
	@Column(name = "min_order_amt")
	private double minOrderAmt;
	
	@Column(name = "is_active")
	private boolean isActive;
	
	@Column(name = "valid_from")
	private LocalDate validFrom;
	
	@Column(name = "valid_until")
	private LocalDate validUntil;

	public Coupon(String couponCode, double discountValue, double minOrderAmt, boolean isActive, LocalDate validFrom,
			LocalDate validUntil) {
		super();
		this.couponCode = couponCode;
		this.discountValue = discountValue;
		this.minOrderAmt = minOrderAmt;
		this.isActive = isActive;
		this.validFrom = validFrom;
		this.validUntil = validUntil;
	}
	
	
}
