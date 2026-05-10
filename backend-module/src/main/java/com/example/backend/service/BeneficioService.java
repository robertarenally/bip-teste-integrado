package com.example.backend.service;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.repository.BeneficioRepository;
import com.example.ejb.domain.Beneficio;
import com.example.ejb.service.BeneficioEjbService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BeneficioService {

    private final BeneficioRepository beneficioRepository;
    private final BeneficioEjbService beneficioEjbService;

    public BeneficioService(
            BeneficioRepository beneficioRepository,
            BeneficioEjbService beneficioEjbService
    ) {
        this.beneficioRepository = beneficioRepository;
        this.beneficioEjbService = beneficioEjbService;
    }

    @Transactional(readOnly = true)
    public List<BeneficioResponse> listar() {
        return beneficioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BeneficioResponse buscarPorId(Long id) {
        Beneficio beneficio = buscarEntidadePorId(id);
        return toResponse(beneficio);
    }

    @Transactional
    public BeneficioResponse criar(BeneficioRequest request) {
    	
    	Beneficio beneficio = Beneficio.criar(
                request.nome(),
                request.descricao(),
                request.valor()
        );

        Beneficio salvo = beneficioRepository.save(beneficio);
        return toResponse(salvo);
    }

    @Transactional
    public BeneficioResponse atualizar(Long id, BeneficioRequest request) {
        Beneficio beneficio = buscarEntidadePorId(id);

        beneficio.atualizar(
                request.nome(),
                request.descricao(),
                request.valor(),
                request.ativo()
        );

        return toResponse(beneficio);
    }

    @Transactional
    public void excluir(Long id) {
        Beneficio beneficio = buscarEntidadePorId(id);
        beneficioRepository.delete(beneficio);
    }

    @Transactional
    public void transferir(TransferenciaRequest request) {
        beneficioEjbService.transfer(
                request.fromId(),
                request.toId(),
                request.amount()
        );
    }

    private Beneficio buscarEntidadePorId(Long id) {
        return beneficioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Benefício não encontrado com id: " + id
                ));
    }

    private BeneficioResponse toResponse(Beneficio beneficio) {
        return new BeneficioResponse(
                beneficio.getId(),
                beneficio.getNome(),
                beneficio.getDescricao(),
                beneficio.getValor(),
                beneficio.getAtivo(),
                beneficio.getVersion()
        );
    }
}