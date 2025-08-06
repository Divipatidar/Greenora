package com.cdac.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entities.Cart;
import java.util.List;
import java.util.Optional;

import com.cdac.entities.User;


public interface CartDao extends JpaRepository<Cart, Long > {
        Optional<Cart> findByUser(User user);
}
