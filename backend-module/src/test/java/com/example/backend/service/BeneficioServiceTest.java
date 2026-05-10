package com.example.backend.service;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.repository.BeneficioRepository;
import com.example.ejb.domain.Beneficio;
import com.example.ejb.service.BeneficioEjbService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BeneficioServiceTest {

	@Mock
	private BeneficioRepository beneficioRepository;

	@Mock
	private BeneficioEjbService beneficioEjbService;

	@InjectMocks
	private BeneficioService beneficioService;

	@Test
	@DisplayName("Deve listar benefícios com sucesso")
	void deveListarBeneficiosComSucesso() {
		Beneficio beneficio = Beneficio.criar("Vale Alimentação", "Benefício mensal", new BigDecimal("500.00"));

		when(beneficioRepository.findAll()).thenReturn(List.of(beneficio));

		List<BeneficioResponse> response = beneficioService.listar();

		assertThat(response).hasSize(1);
		assertThat(response.get(0).nome()).isEqualTo("Vale Alimentação");
		assertThat(response.get(0).descricao()).isEqualTo("Benefício mensal");
		assertThat(response.get(0).valor()).isEqualByComparingTo("500.00");
		assertThat(response.get(0).ativo()).isTrue();

		verify(beneficioRepository).findAll();
	}

	@Test
	@DisplayName("Deve buscar benefício por id com sucesso")
	void deveBuscarBeneficioPorIdComSucesso() {
		Beneficio beneficio = Beneficio.criar("Plano Saúde", "Benefício corporativo", new BigDecimal("800.00"));

		when(beneficioRepository.findById(1L)).thenReturn(Optional.of(beneficio));

		BeneficioResponse response = beneficioService.buscarPorId(1L);

		assertThat(response.nome()).isEqualTo("Plano Saúde");
		assertThat(response.descricao()).isEqualTo("Benefício corporativo");
		assertThat(response.valor()).isEqualByComparingTo("800.00");
		assertThat(response.ativo()).isTrue();

		verify(beneficioRepository).findById(1L);
	}

	@Test
	@DisplayName("Deve lançar exceção ao buscar benefício inexistente")
	void deveLancarExcecaoAoBuscarBeneficioInexistente() {
		when(beneficioRepository.findById(99L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> beneficioService.buscarPorId(99L)).isInstanceOf(EntityNotFoundException.class)
				.hasMessageContaining("Benefício não encontrado com id: 99");

		verify(beneficioRepository).findById(99L);
	}

	@Test
	@DisplayName("Deve criar benefício com sucesso")
	void deveCriarBeneficioComSucesso() {
		BeneficioRequest request = new BeneficioRequest("Auxílio Transporte", "Benefício para transporte",
				new BigDecimal("300.00"), true);

		Beneficio beneficioSalvo = Beneficio.criar("Auxílio Transporte", "Benefício para transporte",
				new BigDecimal("300.00"));

		when(beneficioRepository.save(any(Beneficio.class))).thenReturn(beneficioSalvo);

		BeneficioResponse response = beneficioService.criar(request);

		assertThat(response.nome()).isEqualTo("Auxílio Transporte");
		assertThat(response.descricao()).isEqualTo("Benefício para transporte");
		assertThat(response.valor()).isEqualByComparingTo("300.00");
		assertThat(response.ativo()).isTrue();

		verify(beneficioRepository).save(any(Beneficio.class));
	}

	@Test
	@DisplayName("Deve atualizar benefício com sucesso")
	void deveAtualizarBeneficioComSucesso() {
		Beneficio beneficio = Beneficio.criar("Vale Alimentação", "Benefício mensal", new BigDecimal("500.00"));

		BeneficioRequest request = new BeneficioRequest("Vale Refeição", "Benefício atualizado",
				new BigDecimal("650.00"), true);

		when(beneficioRepository.findById(1L)).thenReturn(Optional.of(beneficio));

		BeneficioResponse response = beneficioService.atualizar(1L, request);

		assertThat(response.nome()).isEqualTo("Vale Refeição");
		assertThat(response.descricao()).isEqualTo("Benefício atualizado");
		assertThat(response.valor()).isEqualByComparingTo("650.00");
		assertThat(response.ativo()).isTrue();

		verify(beneficioRepository).findById(1L);
	}

	@Test
	@DisplayName("Deve excluir benefício com sucesso")
	void deveExcluirBeneficioComSucesso() {
		Beneficio beneficio = Beneficio.criar("Vale Alimentação", "Benefício mensal", new BigDecimal("500.00"));

		when(beneficioRepository.findById(1L)).thenReturn(Optional.of(beneficio));

		beneficioService.excluir(1L);

		verify(beneficioRepository).findById(1L);
		verify(beneficioRepository).delete(beneficio);
	}

	@Test
	@DisplayName("Deve transferir valor utilizando o serviço EJB")
	void deveTransferirValorUtilizandoServicoEjb() {
		TransferenciaRequest request = new TransferenciaRequest(1L, 2L, new BigDecimal("100.00"));

		beneficioService.transferir(request);

		verify(beneficioEjbService).transfer(1L, 2L, new BigDecimal("100.00"));
	}
}