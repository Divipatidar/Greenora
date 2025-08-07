package com.cdac.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class OrderItem  extends BaseEntity{
	 
     private int quantity;
     
     private double price;
     
     @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER, orphanRemoval = true)
     @JsonManagedReference
     @JoinColumn(name = "product_id",unique = false)
     private Product product;
     
     
     @ManyToOne(fetch =FetchType.LAZY)
      @JoinColumn(name = "order_id",unique = false)
     @JsonBackReference
     private Order order;


	public OrderItem(int quantity, double price, Product product, Order order) {
		super();
		this.quantity = quantity;
		this.price = price;
		this.product = product;
		this.order = order;
	}
     
     
     
}
