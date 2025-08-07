package com.cdac.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dao.CartDao;
import com.cdac.dao.CartItemDao;
import com.cdac.dao.CouponDao;
import com.cdac.dao.OrderDao;
import com.cdac.dao.OrderItemDao;
import com.cdac.dao.PaymentDao;
import com.cdac.dao.ProductDao;
import com.cdac.dao.UserDao;
import com.cdac.dto.ApiResponse;
import com.cdac.dto.OrderResDto;
import com.cdac.dto.OrderSummaryDto;
import com.cdac.dto.PaymentResDto;
import com.cdac.entities.Cart;
import com.cdac.entities.CartItem;
import com.cdac.entities.Coupon;
import com.cdac.entities.DeliveryStatus;
import com.cdac.entities.Order;
import com.cdac.entities.OrderItem;
import com.cdac.entities.Payment;
import com.cdac.entities.PaymentMethod;
import com.cdac.entities.PaymentStatus;
import com.cdac.entities.Product;
import com.cdac.entities.User;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceimpl implements OrderService {
    
	private final ModelMapper modalmapper;
	private final OrderDao orderdao;
	private final OrderItemDao orderItemdao;
	private final UserDao userdao;
	private final CartDao cartdao;
	private final CartItemDao cartitemdao;
	private final ProductDao productdao;
	private final  CouponDao coupondao;
	private  final PaymentDao paymentdao;
	
	@Value("${razorpay.key_id}")
	private String razorpayKeyId;
	
	@Value("${razorpay.key_secret}")
	private String razorpayKeySecret;
	
	@Override
	public PaymentResDto placeOrder(Long userId, Long addressId, Long couponId) {
		User user = userdao.findById(userId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid user id!!!"));
		   Cart cart = cartdao.findByUser(user).orElseGet(
				   ()->cartdao.save(new Cart(user)));
		   
		   List<CartItem> list = cartitemdao.findByCartId(cart.getId());
		     if(list.isEmpty()) throw new ResourseNotFoundException("cart is empty");
		     
		     System.out.println(list.toString());
		     
		     double total = list.stream()
		                .mapToDouble(item -> item.getQuantity() * item.getPrice())
		                .sum();
		     
		     if (couponId != null) {
		            Coupon coupon = coupondao.findById(couponId)
		                    .orElseThrow(() -> new ResourseNotFoundException("Invalid coupon"));
		            if (total >= coupon.getMinOrderAmt() && coupon.isActive()) {
		                total -= coupon.getDiscountValue();
		            }
		        }
		   
		     Order order= new Order(total,LocalDate.now(),DeliveryStatus.PROCESSING, user);
		     Order order2 = orderdao.save(order);
		     com.razorpay.Order razorpayOrder=null;
		     try {
		    	 // Create Razorpay order for test
		    	 RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
		    	 
		    	 JSONObject orderRequest = new JSONObject();
		    	 orderRequest.put("amount", (int)(total * 100)); // Amount in paise
		    	 orderRequest.put("currency", "INR");
		    	 orderRequest.put("receipt", "order_" + order2.getId());
		    	 
		    	 razorpayOrder= razorpayClient.orders.create(orderRequest);
		    	 
		    	 // Create Payment record
		    	 Payment payment = new Payment();
		    	 payment.setOrderId(order2); // Set order relationship
		    	 payment.setMethod(PaymentMethod.CREDIT_CARD); // Test payment method
		    	 payment.setStatus(PaymentStatus.COMPLETED); // Initial status
		    	 payment.setTransactionId(razorpayOrder.get("id")); // Razorpay order ID
		    	 payment.setAmount(total);
		    	 payment.setDatetime(LocalDateTime.now());
		    	 
		    	 paymentdao.save(payment);
		    	 
		    	 System.out.println("Razorpay Order Created: " + razorpayOrder.get("id"));
		    	 
		     } catch (RazorpayException e) {
		    	 System.out.println("Razorpay error (test mode): " + e.getMessage());
		    	 // Continue with order creation even if Razorpay fails in test mode
		     }
		     
		     
		     for(CartItem item :  list) {
		    	 orderItemdao.save(new OrderItem(item.getQuantity(), 
		    			 item.getPrice(),item.getProduct(), order2));
		    	Product product = item.getProduct();
		    	product.setQuantity(product.getQuantity()-item.getQuantity());
		    	productdao.save(product);
		     }
		     
		     cartitemdao.deleteAll(list);
		     
		return new PaymentResDto(razorpayOrder.get("id"),order2.getTotalAmt(),"INR",order2.getId());
	}

	@Override
	public List<OrderResDto> getOrdersByUser(Long userId) {
		
		return orderdao.findByUserIdOrderByOrderDateDesc(userId)
			  .stream()
			  .map(o->modalmapper.map(o, OrderResDto.class)).toList();
	}

	@Override
	public OrderSummaryDto getOrderById(Long orderId) {
		 System.out.println("order "+ orderId);
		Order order = orderdao.findById(orderId).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid order id!!!"));
		return modalmapper.map(order, OrderSummaryDto.class);
	}
      
	@Override
	public List<Order> getAlllOrders() {
		
		return orderdao.findAll();
	}

	@Override
	public ApiResponse orderUpdate(Long Id, String deliverStatus) {
		Order order = orderdao.findById(Id).orElseThrow(
				   ()-> new ResourseNotFoundException("invalid order id!!!"));
		order.setDeliveryStatus(DeliveryStatus.valueOf(deliverStatus));
		return new ApiResponse("status updated!!!");
		
	}

	

}
