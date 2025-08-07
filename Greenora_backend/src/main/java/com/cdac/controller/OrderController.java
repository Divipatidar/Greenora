	package com.cdac.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.OrderResDto;
import com.cdac.dto.OrderSummaryDto;
import com.cdac.dto.PaymentResDto;
import com.cdac.entities.Order;
import com.cdac.service.OrderService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/orders")
@Validated
@CrossOrigin(" http://localhost:5173")

public class OrderController {
  private final OrderService orderservice;
  
  @PostMapping("/user/{userId}/address/{addressId}")
  public ResponseEntity<?> placeOrder(@PathVariable Long userId,@PathVariable Long addressId,@RequestParam(required = false) Long couponId){
	  PaymentResDto order = orderservice.placeOrder(userId, addressId, couponId);
	  return ResponseEntity.ok(order);
  }
  @GetMapping("user/{userId}")
  public ResponseEntity<?>  getOrderByUser(@PathVariable Long userId){
	  List<OrderResDto> list = orderservice.getOrdersByUser(userId);
	  if(list.isEmpty()) {
		  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	  }
	  return ResponseEntity.ok(list);
  }
  @GetMapping("/{orderId}")
  public ResponseEntity<?> getOrderById(@PathVariable Long orderId){
	  System.out.println("order iud" + orderId);
	  OrderSummaryDto order = orderservice.getOrderById(orderId);
	  return ResponseEntity.ok(order);

  }
  @GetMapping
  public ResponseEntity<?>  getAll(){
	  List<Order> list = orderservice.getAlllOrders();
	  return ResponseEntity.ok(list);
  }
  @PutMapping("/{id}")
  public ResponseEntity<?> updateStatus(@PathVariable Long id,@RequestParam String status){
	   return ResponseEntity.ok(orderservice.orderUpdate(id, status));
  }
}
