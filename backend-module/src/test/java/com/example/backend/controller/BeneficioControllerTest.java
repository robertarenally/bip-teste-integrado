package com.example.backend.controller;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.service.BeneficioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class BeneficioControllerTest {

	private MockMvc mockMvc;

	private ObjectMapper objectMapper;

	@Mock
	private BeneficioService beneficioService;

	@BeforeEach
	void setup() {
		BeneficioController beneficioController = new BeneficioController(beneficioService);

		mockMvc = MockMvcBuilders.standaloneSetup(beneficioController).build();

		objectMapper = new ObjectMapper();
	}

	@Test
	@DisplayName("Deve listar benefícios")
	void deveListarBeneficios() throws Exception {
		BeneficioResponse response = new BeneficioResponse(1L, "Vale Alimentação", "Benefício mensal",
				new BigDecimal("500.00"), true, 0L);

		when(beneficioService.listar()).thenReturn(List.of(response));

		mockMvc.perform(get("/api/v1/beneficios")).andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value(1L))
				.andExpect(jsonPath("$[0].nome").value("Vale Alimentação"))
				.andExpect(jsonPath("$[0].descricao").value("Benefício mensal"))
				.andExpect(jsonPath("$[0].valor").value(500.00)).andExpect(jsonPath("$[0].ativo").value(true));

		verify(beneficioService).listar();
	}

	@Test
	@DisplayName("Deve buscar benefício por id")
	void deveBuscarBeneficioPorId() throws Exception {
		BeneficioResponse response = new BeneficioResponse(1L, "Plano Saúde", "Benefício corporativo",
				new BigDecimal("800.00"), true, 0L);

		when(beneficioService.buscarPorId(1L)).thenReturn(response);

		mockMvc.perform(get("/api/v1/beneficios/1")).andExpect(status().isOk()).andExpect(jsonPath("$.id").value(1L))
				.andExpect(jsonPath("$.nome").value("Plano Saúde"))
				.andExpect(jsonPath("$.descricao").value("Benefício corporativo"))
				.andExpect(jsonPath("$.valor").value(800.00)).andExpect(jsonPath("$.ativo").value(true));

		verify(beneficioService).buscarPorId(1L);
	}

	@Test
	@DisplayName("Deve criar benefício")
	void deveCriarBeneficio() throws Exception {
		BeneficioRequest request = new BeneficioRequest("Auxílio Transporte", "Benefício para transporte",
				new BigDecimal("300.00"), true);

		BeneficioResponse response = new BeneficioResponse(1L, "Auxílio Transporte", "Benefício para transporte",
				new BigDecimal("300.00"), true, 0L);

		when(beneficioService.criar(any(BeneficioRequest.class))).thenReturn(response);

		mockMvc.perform(post("/api/v1/beneficios").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").value(1L)).andExpect(jsonPath("$.nome").value("Auxílio Transporte"))
				.andExpect(jsonPath("$.descricao").value("Benefício para transporte"))
				.andExpect(jsonPath("$.valor").value(300.00)).andExpect(jsonPath("$.ativo").value(true));

		verify(beneficioService).criar(any(BeneficioRequest.class));
	}

	@Test
	@DisplayName("Deve atualizar benefício")
	void deveAtualizarBeneficio() throws Exception {
		BeneficioRequest request = new BeneficioRequest("Vale Refeição", "Benefício atualizado",
				new BigDecimal("650.00"), true);

		BeneficioResponse response = new BeneficioResponse(1L, "Vale Refeição", "Benefício atualizado",
				new BigDecimal("650.00"), true, 0L);

		when(beneficioService.atualizar(eq(1L), any(BeneficioRequest.class))).thenReturn(response);

		mockMvc.perform(put("/api/v1/beneficios/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1L)).andExpect(jsonPath("$.nome").value("Vale Refeição"))
				.andExpect(jsonPath("$.descricao").value("Benefício atualizado"))
				.andExpect(jsonPath("$.valor").value(650.00)).andExpect(jsonPath("$.ativo").value(true));

		verify(beneficioService).atualizar(eq(1L), any(BeneficioRequest.class));
	}

	@Test
	@DisplayName("Deve excluir benefício")
	void deveExcluirBeneficio() throws Exception {
		mockMvc.perform(delete("/api/v1/beneficios/1")).andExpect(status().isNoContent());

		verify(beneficioService).excluir(1L);
	}

	@Test
	@DisplayName("Deve transferir valor entre benefícios")
	void deveTransferirValorEntreBeneficios() throws Exception {
		TransferenciaRequest request = new TransferenciaRequest(1L, 2L, new BigDecimal("100.00"));

		mockMvc.perform(post("/api/v1/beneficios/transferencias").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isOk());

		verify(beneficioService).transferir(any(TransferenciaRequest.class));
	}

}