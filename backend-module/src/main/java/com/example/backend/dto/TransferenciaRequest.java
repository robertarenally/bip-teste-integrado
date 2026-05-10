package com.example.backend.dto;

import java.math.BigDecimal;

public record TransferenciaRequest(
        Long origemId,
        Long destinoId,
        BigDecimal valor
) {}