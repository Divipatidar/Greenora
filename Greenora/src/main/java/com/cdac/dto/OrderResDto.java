package com.cdac.dto;

import java.time.LocalDate;
import java.util.List;

import com.cdac.entities.Coupon;
import com.cdac.entities.DeliveryStatus;
import com.cdac.entities.OrderItem;
import com.cdac.entities.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderResDto extends BaseDto {
private double totalAmt;
	
	private LocalDate orderDate;
	private DeliveryStatus deliveryStatus;
	
	private LocalDate deliveryDate;
	
    private User user;
	
	private Coupon coupon;
	
	private List<OrderItem> orderItems;
}
