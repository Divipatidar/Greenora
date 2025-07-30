package com.cdac.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entities.CartItem;
import java.util.List;
import java.util.Optional;

import com.cdac.entities.Product;


public interface CartItemDao extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    void deleteByCartIdAndProductId(Long cartId, Long productId);
    void deleteByCartId(Long cartId);
    List<CartItem> findByCartId(Long cartId);
}
