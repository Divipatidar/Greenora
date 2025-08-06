package com.cdac.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResDto extends BaseDto {
     
	 private String razorpayOrderId;
	    private double amount;
	    private String currency;
	    private Long id;
}
