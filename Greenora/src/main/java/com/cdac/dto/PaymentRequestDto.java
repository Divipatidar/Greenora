package com.cdac.dto;

import java.time.LocalDateTime;

import com.cdac.entities.Order;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PaymentRequestDto extends BaseDto {
     
	private int orderId;
	
	
	private String method;
	
	private String  status;
	

	private String transactionId;	
	
	private double amount;
	private LocalDateTime datetime;
}
