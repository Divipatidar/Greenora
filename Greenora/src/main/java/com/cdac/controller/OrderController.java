package com.cdac.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.entities.Order;
import com.cdac.service.OrderService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/orders")
public class OrderController {
  private final OrderService orderservice;
  
  @PostMapping("/user/{userId}/address/{addressId}/coupon/{couponId}")
  public ResponseEntity<?> placeOrder(@PathVariable Long userId,@PathVariable Long addressId,@PathVariable(required = false) Long couponId){
	  Order order = orderservice.placeOrder(userId, addressId, couponId);
	  return ResponseEntity.ok(order);
  }
  @GetMapping("user/{userId}")
  public ResponseEntity<?>  getOrderByUser(@PathVariable Long userId){
	  List<Order> list = orderservice.getOrdersByUser(userId);
	  if(list.isEmpty()) {
		  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	  }
	  return ResponseEntity.ok(list);
  }
  @GetMapping("/{orderId}")
  public ResponseEntity<?> getOrderById(@PathVariable Long orderId){
	  Order order = orderservice.getOrderById(orderId);
	  return ResponseEntity.ok(order);

  }
}
