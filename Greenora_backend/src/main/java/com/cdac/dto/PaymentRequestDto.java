package com.cdac.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PaymentRequestDto {
     
	 @Positive(message = "Order ID must be a positive number")
	private int orderId;
	 
	 @NotBlank(message = "Payment method is required")
	private String method;
	
	 @NotBlank(message = "Transaction ID is required")
	private String transactionId;	
	
	 @DecimalMin(value = "0.1", inclusive = true, message = "Amount must be at least 0.1")
	private double amount;
}
