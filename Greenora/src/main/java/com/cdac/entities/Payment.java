package com.cdac.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@NoArgsConstructor
@Getter
@Setter
public class Payment extends BaseEntity{
	@ManyToOne(fetch =FetchType.EAGER)
	@JoinColumn(name = "order_id",nullable = false)
   private Order orderId;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentMethod method;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentStatus status;
	
	@Column(name = "transaction_id",length = 50)
	private String transactionId;
	
	
	private double amount;
	private LocalDateTime datetime;
	
	
	public Payment(Order orderId, PaymentMethod method, PaymentStatus status, String transactionId, double amount,
			LocalDateTime datetime) {
		super();
		this.orderId = orderId;
		this.method = method;
		this.status = status;
		this.transactionId = transactionId;
		this.amount = amount;
		this.datetime = datetime;
	}
	
	
	
	
}
