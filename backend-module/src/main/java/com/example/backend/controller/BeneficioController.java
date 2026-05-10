package com.example.backend.controller;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.service.BeneficioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Benefícios",
        description = "Endpoints para gerenciamento de benefícios"
)
@RestController
@RequestMapping("/api/v1/beneficios")
public class BeneficioController {

    private final BeneficioService beneficioService;

    public BeneficioController(BeneficioService beneficioService) {
        this.beneficioService = beneficioService;
    }

    @Operation(summary = "Lista todos os benefícios")
    @GetMapping
    public ResponseEntity<List<BeneficioResponse>> listar() {
        return ResponseEntity.ok(beneficioService.listar());
    }

    @Operation(summary = "Busca um benefício pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<BeneficioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(beneficioService.buscarPorId(id));
    }

    @Operation(summary = "Cria um novo benefício")
    @PostMapping
    public ResponseEntity<BeneficioResponse> criar(
            @RequestBody @Valid BeneficioRequest request
    ) {
        BeneficioResponse response = beneficioService.criar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(summary = "Atualiza um benefício existente")
    @PutMapping("/{id}")
    public ResponseEntity<BeneficioResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid BeneficioRequest request
    ) {
        return ResponseEntity.ok(beneficioService.atualizar(id, request));
    }

    @Operation(summary = "Exclui um benefício pelo ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        beneficioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "Transfere valor entre benefícios")
    @PostMapping("/transferencias")
    public ResponseEntity<Void> transferir(
            @RequestBody @Valid TransferenciaRequest request
    ) {
        beneficioService.transferir(request);
        return ResponseEntity.ok().build();
    }
}