package com.cdac.service;

import java.util.List;

import com.cdac.dto.OrderResDto;
import com.cdac.dto.OrderSummaryDto;
import com.cdac.dto.PaymentResDto;
import com.cdac.entities.Order;

public interface OrderService {
	PaymentResDto placeOrder(Long userId, Long addressId, Long couponId);
    List<OrderResDto> getOrdersByUser(Long userId);
    OrderSummaryDto getOrderById(Long orderId);
}
