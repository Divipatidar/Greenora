package com.cdac.service;

import com.cdac.dto.PaymentRequestDto;
import com.cdac.entities.Payment;

public interface PaymentService {
	Payment processPayment(PaymentRequestDto dto);
    Payment getPaymentByOrderId(Long orderId);
}
