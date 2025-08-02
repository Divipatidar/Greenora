package com.cdac.dto;

import java.time.LocalDateTime;

import com.cdac.entities.Order;
import com.cdac.entities.PaymentMethod;
import com.cdac.entities.PaymentStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class PaymentResDto extends BaseDto {
     
	private Order orderId;

	private PaymentMethod method;
	
	private PaymentStatus status;
	
	private String transactionId;
	
	private double amount;
	
	private LocalDateTime datetime;
}
