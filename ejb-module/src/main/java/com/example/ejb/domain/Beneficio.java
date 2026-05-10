package com.example.ejb.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "BENEFICIO")
public class Beneficio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NOME", nullable = false, length = 100)
    private String nome;

    @Column(name = "DESCRICAO", length = 255)
    private String descricao;

    @Column(name = "VALOR", nullable = false, precision = 15, scale = 2)
    private BigDecimal valor = BigDecimal.ZERO;

    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = Boolean.TRUE;

    @Version
    @Column(name = "VERSION")
    private Long version;

    protected Beneficio() {
        // Construtor exigido pelo JPA
    }
    
    public static Beneficio criar(
            String nome,
            String descricao,
            BigDecimal valor
    ) {
        return new Beneficio(nome, descricao, valor);
    }

    private Beneficio(String nome, String descricao, BigDecimal valor) {  	
    	if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        this.nome = nome;
        this.descricao = descricao;
        this.valor = validarValor(valor);
        this.ativo = Boolean.TRUE;
    }
    
    public void atualizar(String nome, String descricao, BigDecimal valor, Boolean ativo) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.nome = nome;
        this.descricao = descricao;
        this.valor = validarValor(valor);
        this.ativo = ativo != null ? ativo : Boolean.TRUE;
    }

    public void debitar(BigDecimal amount) {
        BigDecimal valorTransferencia = validarValor(amount);

    	// Regra de negócio encapsulada no domínio para validar:
    	// - saldo suficiente
        if (this.valor.compareTo(valorTransferencia) < 0) {
            throw new IllegalStateException("Saldo insuficiente para realizar a transferência.");
        }

        this.valor = this.valor.subtract(valorTransferencia);
    }

    public void creditar(BigDecimal amount) {
        BigDecimal valorTransferencia = validarValor(amount);
        this.valor = this.valor.add(valorTransferencia);
    }

	// Regra de negócio encapsulada no domínio para validar:
	// - valor positivo
	// - integridade do estado da entidade
    private BigDecimal validarValor(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor deve ser maior que zero.");
        }

        return amount;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public Long getVersion() {
        return version;
    }

    public boolean isAtivo() {
        return Boolean.TRUE.equals(ativo);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Beneficio beneficio)) return false;
        return id != null && Objects.equals(id, beneficio.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}