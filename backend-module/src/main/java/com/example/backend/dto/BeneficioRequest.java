package com.example.backend.dto;

import java.math.BigDecimal;

public record BeneficioRequest(
        String nome,
        String descricao,
        BigDecimal valor,
        Boolean ativo
) {}