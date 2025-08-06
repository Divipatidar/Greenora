package com.cdac.service;

import com.cdac.dto.PaymentRequestDto;
import com.cdac.dto.PaymentResDto;
import com.cdac.entities.Payment;

public interface PaymentService {
	PaymentResDto processPayment(PaymentRequestDto dto);
    Payment getPaymentByOrderId(Long orderId);
}
