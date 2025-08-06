package com.cdac.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Review extends BaseEntity {
	@ManyToOne(fetch =FetchType.LAZY)
	 @JoinColumn(name = "product_id",nullable = false)
	 private Product product;
	
	@ManyToOne(fetch =FetchType.LAZY)
	@JoinColumn(name = "order_id",nullable = false)
   private Order orderId;
	
	
	@ManyToOne(fetch =FetchType.LAZY)
	@JoinColumn(name = "user_id",nullable = false)
    private User user;
	
	@Min(1)
	@Max(5)
	private int rating;
	
	@Column(name = "review_text", length = 50)
	private String reviewText;
	
	private LocalDateTime datetime;
	
}
