package com.cdac.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.CartDto;
import com.cdac.entities.Cart;
import com.cdac.service.CartService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/cart")
public class CartController {
  private final CartService cartservice;
  
  
  @GetMapping("/{userId}")
  public ResponseEntity<?> getCartByUserId(@PathVariable Long userId){
	  Cart cart = cartservice.getCartByUserId(userId);
	  return ResponseEntity.ok(cart);
  }
  @PostMapping("/{userId}")
  public ResponseEntity<?> addToCart(@PathVariable Long userId ,@RequestBody CartDto dto){
	  Cart cart = cartservice.addToCart(userId,dto.getProductId(), dto.getQuantity());
	  return ResponseEntity.ok(cart);
  }
  
  @PutMapping("/{userId}")
  public ResponseEntity<?> updateCartItem(@PathVariable Long userId ,@RequestBody CartDto dto){
     Cart cart = cartservice.updateCartItem(userId,dto.getProductId(), dto.getQuantity());
	  return ResponseEntity.ok(cart);

  }
  
  @DeleteMapping("/{userId}/product/{productId}")
  public ResponseEntity<?> removeFromCart(@PathVariable Long userId ,@PathVariable Long productId){
      Cart cart = cartservice.removeFromCart(userId, productId);
	  return ResponseEntity.ok(cart);

  }
  
  @DeleteMapping("/{userId}")
  public ResponseEntity<?> clearCart(@PathVariable Long userId ){
       return ResponseEntity.ok(cartservice.clearCart(userId));
  }
}
