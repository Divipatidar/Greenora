package com.cdac.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Product extends BaseEntity {
	@Column(length=30)
     private String name;
	
	@Column(length=30)
    private String description;
	
	private int quantity;
	
	private double price;
	
	
	private String  image;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name ="category_id")
	private Category category;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name ="vendor_id")
	private User vendor;
	
	@Column(name = "eco_rating")
	private int ecoRating;
	
	@Column(name = "is_active")
	private boolean isActive;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "stock_status")
	private StockStatus stockStatus;
	
}
