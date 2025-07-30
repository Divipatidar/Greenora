package com.cdac.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "users")
@NoArgsConstructor
@Getter
@Setter
public class User extends BaseEntity {
	@Column(length = 50)
	private String name;
   
	@Column(length = 30,unique = true)
	private String email;
	
	@Column(length = 30, nullable = false)
	private String password;
	
	@Size(min = 10, max = 10)
	private String phone;
	
	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private UserRole role;
	
	@OneToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
	@JoinColumn(name="address_id")
	private Address myAddress;
}
