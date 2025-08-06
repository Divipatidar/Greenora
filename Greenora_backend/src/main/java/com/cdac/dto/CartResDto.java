package com.cdac.dto;

import java.util.List;

import com.cdac.entities.CartItem;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartResDto {
  private int quantity;
  private Long productId;
  List<CartItem> items;
}
