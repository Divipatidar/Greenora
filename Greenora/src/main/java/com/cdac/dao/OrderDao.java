package com.cdac.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entities.Order;

public interface OrderDao extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}
