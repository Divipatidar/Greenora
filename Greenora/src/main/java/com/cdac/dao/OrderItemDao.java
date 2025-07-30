package com.cdac.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entities.OrderItem;

public interface OrderItemDao extends JpaRepository<OrderItem,Long> {

}
