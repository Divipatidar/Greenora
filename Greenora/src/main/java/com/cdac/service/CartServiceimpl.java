package com.cdac.service;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dao.CartDao;
import com.cdac.dao.CartItemDao;
import com.cdac.dao.ProductDao;
import com.cdac.dao.UserDao;
import com.cdac.dto.ApiResponse;
import com.cdac.dto.CartResDto;
import com.cdac.entities.Cart;
import com.cdac.entities.CartItem;
import com.cdac.entities.Product;
import com.cdac.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;



@Service
@Transactional
@AllArgsConstructor
public class CartServiceimpl implements CartService {
	
	private final ModelMapper modalmapper;
	private final UserDao userdao;
	private final CartDao cartdao;
	private final CartItemDao cartitemdao;
	private final ProductDao productdao;
	

	@Override
	public Cart getCartByUserId(Long userId) {
		   User user = userdao.findById(userId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid user id!!!"));
		   Cart cart = cartdao.findByUser(user).orElseGet(
				   ()->cartdao.save(new Cart(user)));
		return cart;
	}

	@Override
	public CartResDto addToCart(Long userId, Long productId, int quantity) {
		User user = userdao.findById(userId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid user id!!!"));
		Cart cart=getCartByUserId(userId);
		
		Product product = productdao.findById(productId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid product id!!!"));
		 CartItem cartItem =null;
		 Optional<CartItem> optional = cartitemdao.findByCartIdAndProductId(cart.getId(), productId);
		
		
		if(optional.isPresent()) {
			cartItem=optional.get();
			cartItem.setQuantity(cartItem.getQuantity() +quantity);
			}
		else {
			cartItem= new CartItem();
			cartItem.setCart(cart);
			cartItem.setProduct(product);
			cartItem.setQuantity(quantity);
		}
		cartItem.setPrice(product.getPrice());
		
		cartitemdao.save(cartItem);
		CartResDto dto= new CartResDto();
		dto.setQuantity(quantity);
		dto.setProductId(productId);
		dto.setItems(cart.getItems());
		return dto;
	}

	@Override
	public Cart updateCartItem(Long userId, Long productId, int quantity) {
		Cart cart=getCartByUserId(userId);
		CartItem cartItem = cartitemdao.findByCartIdAndProductId(cart.getId(), productId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid cart and product  id!!!"));
		
         cartItem.setQuantity(quantity);
         
 		cartitemdao.save(cartItem);

		return cart;
	}

	@Override
	public ApiResponse removeFromCart(Long userId, Long productId) {
		User user = userdao.findById(userId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid user id!!!"));
		
		Product product = productdao.findById(productId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid product id!!!")); 
		
		Cart cart=getCartByUserId(userId);
		if(cart==null) throw new ResourseNotFoundException("cart not found");
          
		cartitemdao.deleteByCartIdAndProductId(cart.getId(), productId);
		return new ApiResponse("deleted!!");
	}

	@Override
	public ApiResponse clearCart(Long userId) {
		Cart cart=getCartByUserId(userId);

      cartitemdao.deleteByCartId(cart.getId());
      return new ApiResponse("cart cleared!!!");
	}

}
