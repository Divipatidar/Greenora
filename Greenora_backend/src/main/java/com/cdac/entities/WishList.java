package com.cdac.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class WishList extends BaseEntity {
    
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	
}
