package com.e_commerce.the_hardware_vault.api.Enum;

public enum AuthorityRole {
    VIEWER,    // Гость, просмотр доступной информации
    CUSTOMER,  // Покупатель, доступ к бизнес-логике
    ADMIN      // Администратор, доступ ко всем операциям
}