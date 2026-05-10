package com.example.backend.dto;

import java.math.BigDecimal;

public record TransferenciaRequest(
        Long fromId,
        Long toId,
        BigDecimal amount
) {}