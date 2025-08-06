package com.cdac.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entities.WishList;

public interface WishListDao extends JpaRepository<WishList, Long> {

}
