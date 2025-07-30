package com.cdac.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.PaymentRequestDto;
import com.cdac.entities.Payment;
import com.cdac.service.PaymentService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/payment")
public class Paymentcontroller {
	private final PaymentService paymentservice;

	@PostMapping
	public ResponseEntity<?> makepayment(@RequestBody PaymentRequestDto dto) {
		Payment payment = paymentservice.processPayment(dto);
		return ResponseEntity.ok(payment);
	}

	@GetMapping("/order/{orderId}")
	public ResponseEntity<Payment> getByOrder(@PathVariable Long orderId) {
		return ResponseEntity.ok(paymentservice.getPaymentByOrderId(orderId));

	}
}
