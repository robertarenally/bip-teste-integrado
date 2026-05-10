package com.example.ejb.service;

import com.example.ejb.domain.Beneficio;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;

@Stateless
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    public void transfer(Long fromId, Long toId, BigDecimal amount) {
    	
    	// Aplica lock pessimista para impedir alterações simultâneas
    	// nos registros durante a transferência, evitando inconsistência
    	// de saldo e problemas de concorrência (lost update)
        Beneficio from = em.find(Beneficio.class, fromId, LockModeType.PESSIMISTIC_WRITE);
        Beneficio to = em.find(Beneficio.class, toId, LockModeType.PESSIMISTIC_WRITE);

        //resolve o bug das validações
        if (from == null || to == null) {
            throw new IllegalArgumentException("Benefício de origem ou destino não encontrado.");
        }
	    // Encapsula as regras de negócio no domínio da entidade,
	    // garantindo validações de saldo e integridade da transferência
        from.debitar(amount);     
        to.creditar(amount);
    }
}