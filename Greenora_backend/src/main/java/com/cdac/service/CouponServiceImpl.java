package com.cdac.service;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cdac.custom_exception.InvalidInputException;
import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dao.CouponDao;
import com.cdac.dto.CouponDto;
import com.cdac.entities.Coupon;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;


@Service
@Transactional
@AllArgsConstructor
public class CouponServiceImpl implements CouponService {

	
	
	private final ModelMapper modalmapper;
	private final CouponDao coupondao;
	@Override
	public Coupon addCoupon(CouponDto dto) {
	     Coupon coupon = modalmapper.map(dto, Coupon.class);
	      coupon.setActive(true);
		return coupondao.save(coupon);
	}

	@Override
	public Coupon updateCoupon(Long id, CouponDto dto) {
		// TODO Auto-generated method stub
		Coupon coupon = coupondao.findById(id).orElseThrow(()->
		new ResourseNotFoundException("invalid couponid!!!"));
		modalmapper.map(dto,coupon);
		
		return coupondao.save(coupon);
	}

	@Override
	public void deleteCoupon(Long id) {
		coupondao.deleteById(id);

	}

	@Override
	public Coupon validateAndGet(String code, double orderAmount) {
		   Coupon coupon = coupondao.findByCouponCodeIgnoreCase(code).orElseThrow(
				   ()-> new InvalidInputException("invalid code!"));
		   
		   LocalDate today= LocalDate.now();
		   if(!coupon.isActive()  || 
				   today.isBefore(coupon.getValidFrom())
				   || today.isAfter(coupon.getValidUntil())) {
			   throw new InvalidInputException("coupon is not valid!!");
		   }
		   
		   if(orderAmount<coupon.getMinOrderAmt()) {
			   throw new InvalidInputException("minimum amt not reached!!");
		   }
		return coupon;
	}

	@Override
	public List<Coupon> getAllActiveCoupons() {
		return coupondao.findByIsActiveTrue();
	}

}
