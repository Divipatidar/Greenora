package com.cdac.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entities.Review;

public interface ReviewDao extends JpaRepository<Review, Long> {

}
