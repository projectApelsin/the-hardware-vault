package com.e_commerce.the_hardware_vault.api.controller;

import com.e_commerce.the_hardware_vault.api.DTO.auth.LoginDTO;
import com.e_commerce.the_hardware_vault.api.DTO.auth.RegisterDTO;
import com.e_commerce.the_hardware_vault.api.Enum.AuthorityRole;
import com.e_commerce.the_hardware_vault.service.CustomerService;
import com.e_commerce.the_hardware_vault.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final CustomerService customerService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public AuthController(CustomerService customerService, AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.customerService = customerService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Устанавливаем пользователя в SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Получаем роль пользователя
        AuthorityRole role = customerService.getRoleByEmail(request.getEmail());

        Integer customerId = customerService.getCustomerId(request.getEmail());

        // Генерируем токены
        String accessToken = jwtService.generateToken(request.getEmail(), customerId ,role, 1000L * 60 * 15 ); // 15 минут
        String refreshToken = jwtService.generateRefreshToken(request.getEmail());

        // Устанавливаем токены в куки
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(false)
                .secure(true) // Только HTTPS
                .path("/")
                .maxAge( 60 * 15) // 15 минут
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(false)
                .secure(true) // Только HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 дней
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", accessCookie.toString())
                .header("Set-Cookie", refreshCookie.toString())
                .body(Map.of("customerId", customerId));
    }

    /**
     * Обновление Access Token
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        System.out.print("Test1");
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;

        // Извлекаем refreshToken из куки
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null || !jwtService.validateToken(refreshToken, jwtService.getREFRESH_SECRET_KEY())) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }

        String username = jwtService.extractUsername(refreshToken, jwtService.getREFRESH_SECRET_KEY());
        AuthorityRole role = jwtService.extractRole(refreshToken, jwtService.getREFRESH_SECRET_KEY());

        // Генерация нового Access Token
        String newAccessToken = jwtService.generateToken(username, customerService.getCustomerId(username), role, 1000L * 60 * 15); // 15 минут

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(15 * 60)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", accessCookie.toString())
                .body("Token refreshed");
    }

    /**
     * Регистрация нового пользователя
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO request) {
        return customerService.registerCustomer(request);
    }


}
