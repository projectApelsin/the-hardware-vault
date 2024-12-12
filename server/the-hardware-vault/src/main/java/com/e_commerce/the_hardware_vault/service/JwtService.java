package com.e_commerce.the_hardware_vault.service;

import com.e_commerce.the_hardware_vault.api.Enum.AuthorityRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Getter
@Component
public class JwtService {

    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Ключ для Access Token
    private final SecretKey REFRESH_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Ключ для Refresh Token

    public SecretKey getSECRET_KEY() {
        return SECRET_KEY;
    }



    public SecretKey getREFRESH_SECRET_KEY() {
        return REFRESH_SECRET_KEY;
    }

    /**
     * Генерация Access Token.
     */
    public String generateToken(String username, Integer customerId, AuthorityRole role, long expiration) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role.name()); // Добавляем роль в Claims
        claims.put("customerId", customerId);
        return createToken(claims, username, expiration, SECRET_KEY);
    }

    public Integer extractCustomerId(String token, SecretKey key) {
        return extractClaims(token, key).get("customerId", Integer.class);
    }

    public String getTokenFromRequest(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {  // или используйте нужное имя для токена
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return "token not found";
        }

        return token;
    }


    /**
     * Генерация Refresh Token.
     */
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", AuthorityRole.CUSTOMER.name()); // По умолчанию "CUSTOMER"
        return createToken(claims, username, 1000L * 60 * 60 * 24 * 7, REFRESH_SECRET_KEY); // 7 дней
    }

    /**
     * Создание токена (общий метод для Access и Refresh Token).
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration, SecretKey key) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // Устанавливаем username как Subject
                .setIssuedAt(new Date()) // Время создания токена
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Устанавливаем срок действия
                .signWith(key) // Подпись токена
                .compact();
    }

    /**
     * Извлечение роли из токена.
     */
    public AuthorityRole extractRole(String token, SecretKey key) {
        String role = extractClaims(token, key).get("role", String.class);
        return AuthorityRole.valueOf(role);
    }

    /**
     * Извлечение Claims из токена с указанием ключа.
     */
    public Claims extractClaims(String token, SecretKey key) {
        return Jwts.parserBuilder()
                .setSigningKey(key) // Устанавливаем ключ для валидации
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Проверка валидности токена с указанием ключа.
     */
    public boolean validateToken(String token, SecretKey key) {
        System.out.println("Валідую токен: " + token);
        try {
            extractClaims(token, key); // Проверяем, можно ли извлечь Claims
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Токен недействителен
        }
    }

    /**
     * Извлечение имени пользователя из токена с указанием ключа.
     */
    public String extractUsername(String token, SecretKey key) {
        return extractClaims(token, key).getSubject(); // Получаем Subject, который мы установили как username
    }
}
