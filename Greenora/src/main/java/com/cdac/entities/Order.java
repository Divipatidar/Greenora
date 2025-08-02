package com.cdac.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@Setter
@Getter
@ToString
@Table(name="orders")
public class Order extends BaseEntity {
	@Column(name = "total_amt")
    private double totalAmt;
	
	@Column(name = "order_date")
	private LocalDate orderDate;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "delivery_status")
	private DeliveryStatus deliveryStatus;
	
	@Column(name = "delivery_date")
	private LocalDate deliveryDate;
	
	@ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;
	
	@ManyToOne(optional = true)
	@JoinColumn(nullable = true,name = "coupon_id")
	private Coupon coupon;
	
	@OneToMany(cascade = CascadeType.ALL,mappedBy = "order",orphanRemoval = true,fetch = FetchType.EAGER)
	@JsonManagedReference
	private List<OrderItem> orderItems=new ArrayList<>();

	public Order(double totalAmt, LocalDate orderDate, DeliveryStatus deliveryStatus, User user) {
		super();
		this.totalAmt = totalAmt;
		this.orderDate = orderDate;
		this.deliveryStatus = deliveryStatus;
		this.deliveryDate=LocalDate.now().plusDays(7);
		this.user = user;
	}
	
}
