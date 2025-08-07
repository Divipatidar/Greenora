package com.cdac.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.PaymentRequestDto;
import com.cdac.dto.PaymentResDto;
import com.cdac.entities.Payment;
import com.cdac.service.PaymentService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/payment")
@CrossOrigin(" http://localhost:5173")



@Validated
public class Paymentcontroller {
	private final PaymentService paymentservice;

	@PostMapping
	public ResponseEntity<?> makepayment(@RequestBody  @Valid PaymentRequestDto dto) {
		PaymentResDto payment = paymentservice.processPayment(dto);
		return ResponseEntity.ok(payment);
	}

	@GetMapping("/order/{orderId}")
	public ResponseEntity<Payment> getByOrder(@PathVariable Long orderId) {
		return ResponseEntity.ok(paymentservice.getPaymentByOrderId(orderId));

	}
	@GetMapping
	public ResponseEntity<?> getAll(){
		List<Payment> list = paymentservice.getAll();
		return ResponseEntity.ok(list);
	}
}
