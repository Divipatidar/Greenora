package com.cdac.service;

import java.util.List;

import com.cdac.entities.Order;

public interface OrderService {
	Order placeOrder(Long userId, Long addressId, Long couponId);
    List<Order> getOrdersByUser(Long userId);
    Order getOrderById(Long orderId);
}
