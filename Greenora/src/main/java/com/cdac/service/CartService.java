package com.cdac.service;

import com.cdac.dto.ApiResponse;
import com.cdac.dto.CartResDto;
import com.cdac.entities.Cart;

public interface CartService {
	Cart getCartByUserId(Long userId);
	CartResDto addToCart(Long userId, Long productId, int quantity);
    Cart updateCartItem(Long userId, Long productId, int quantity);
    ApiResponse removeFromCart(Long userId, Long productId);
    ApiResponse clearCart(Long userId);
}
