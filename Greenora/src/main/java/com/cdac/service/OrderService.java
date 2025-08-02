package com.cdac.service;

import java.util.List;

import com.cdac.dto.OrderResDto;
import com.cdac.entities.Order;

public interface OrderService {
	Order placeOrder(Long userId, Long addressId, Long couponId);
    List<OrderResDto> getOrdersByUser(Long userId);
    OrderResDto getOrderById(Long orderId);
}
