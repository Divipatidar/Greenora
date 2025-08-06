package com.cdac.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class CartItem extends BaseEntity {
	 @ManyToOne
	 @JoinColumn(name = "cart_id")
	 @JsonBackReference
     private Cart cart;
	 
	 @ManyToOne
	 @JoinColumn(name = "product_id")
	 private Product product;
	 
	 private int quantity;
	 
	 private double price;
}
