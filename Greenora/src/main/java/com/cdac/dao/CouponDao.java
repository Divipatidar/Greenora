package com.cdac.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entities.Coupon;

public interface CouponDao extends JpaRepository<Coupon, Long> {
	 Optional<Coupon> findByCouponCodeIgnoreCase(String couponCode);
	    List<Coupon> findByIsActiveTrue();
}
