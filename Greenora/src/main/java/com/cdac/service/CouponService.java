package com.cdac.service;

import java.util.List;

import com.cdac.dto.CouponDto;
import com.cdac.entities.Coupon;

public interface CouponService {
	Coupon addCoupon(CouponDto dto);
    Coupon updateCoupon(Long id, CouponDto dto);
    void deleteCoupon(Long id);
    Coupon validateAndGet(String code, double orderAmount);
    List<Coupon> getAllActiveCoupons();
}
