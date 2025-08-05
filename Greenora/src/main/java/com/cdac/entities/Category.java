package com.cdac.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Category extends BaseEntity {
     
	@Column(length = 100)
	private String name;
	
	@Column(length = 150)
	private String description;
	
	@OneToMany(cascade = CascadeType.ALL,mappedBy = "category",orphanRemoval = true)
	@JsonIgnore
	private List<Product> products=new ArrayList<>();
	
	
	public void addProduct(Product product) {
		this.products.add(product);
		product.setCategory(this);
	}
	public void  removeProduct(Product product) {
		this.products.remove(product);
		product.setCategory(null);
	}
	
}
