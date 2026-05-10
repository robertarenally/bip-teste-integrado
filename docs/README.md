# 🏗️ Desafio Fullstack Integrado

🚨 **Instrução Importante (LEIA ANTES DE COMEÇAR)**

❌ NÃO faça fork deste repositório.

Este repositório é fornecido como modelo/base. Para realizar o desafio, você deve:

✅ **Opção correta (obrigatória)**

- Clique em **“Use this template”** (se este repositório estiver marcado como Template)

OU

- Clone este repositório e crie um **NOVO repositório público** em sua conta GitHub.

📌 O resultado deve ser um repositório próprio, independente deste.

---

# 🎯 Objetivo

Criar solução completa em camadas (DB, EJB, Backend, Frontend), corrigindo bug em EJB e entregando aplicação funcional.

---

# 📦 Estrutura

- `db/`: scripts schema e seed
- `ejb-module/`: serviço EJB com bug a ser corrigido
- `backend-module/`: backend Java 8+
- `frontend/`: app Angular
- `docs/`: instruções e critérios
- `.github/workflows/`: CI

---

# ✅ Tarefas do candidato

1. Executar `db/schema.sql` e `db/seed.sql`
2. Corrigir bug no `BeneficioEjbService`
3. Implementar backend CRUD + integração com EJB
4. Desenvolver frontend Angular consumindo backend
5. Implementar testes
6. Documentar (Swagger, README)
7. Enviar link do repositório para análise

---

# 🐞 Correção do Bug no EJB

Problemas corrigidos:

- Validação de saldo insuficiente
- Controle transacional
- Locking pessimista para evitar concorrência
- Prevenção de inconsistência e lost update
- Validações de transferência

---

# 📊 Critérios de avaliação

| Critério                     | Peso |
|------------------------------|------|
| Arquitetura em camadas       | 20%  |
| Correção EJB                 | 20%  |
| CRUD + Transferência         | 15%  |
| Qualidade de código          | 10%  |
| Testes                       | 15%  |
| Documentação                 | 10%  |
| Frontend                     | 10%  |

---

# ▶️ Como executar

## Build do projeto

```bash
mvn clean install
```

## Executar backend

```bash
mvn -pl backend-module spring-boot:run
```

---

# 🗄️ Banco H2

Acesse o console:

```text
http://localhost:8080/h2-console
```

## Configuração da conexão

| Campo     | Valor              |
|------------|--------------------|
| JDBC URL  | jdbc:h2:mem:bipdb |
| User Name | sa                 |
| Password  | *(vazio)*          |

Após conectar, será possível visualizar as tabelas criadas automaticamente pelos scripts:

- `schema.sql`
- `seed.sql`

---

# 📷 Evidências - Banco H2

## Console H2

![H2 Console](docs/images/h2-console.png)

### Resultado esperado

![H2 Console](docs/images/h2-console.png)

---

# 📘 Swagger / OpenAPI

Com o backend em execução, acesse:

```text
http://localhost:8080/swagger-ui.html
```

## OpenAPI JSON

```text
http://localhost:8080/v3/api-docs
```

---

# 📷 Evidências - Swagger

## Swagger UI

> Inserir print da tela do Swagger.

### Exemplo de inserção

```md
![Swagger](docs/images/swagger.png)
```

### Resultado esperado

![Swagger](docs/images/swagger.png)

---

# 🔌 Endpoints principais

## Benefícios

```http
GET /api/v1/beneficios
POST /api/v1/beneficios
PUT /api/v1/beneficios/{id}
DELETE /api/v1/beneficios/{id}
```

## Transferências

```http
POST /api/v1/beneficios/transferencias
```

---

# 🧪 Testando a API via Postman

## Base URL

```text
http://localhost:8080
```

---

## 🔍 Listar benefícios

### Request

```http
GET http://localhost:8080/api/v1/beneficios
```

### 📷 Evidência esperada

```md
![GET Beneficios](docs/images/postman-get-beneficios.png)
```

---

## 🔍 Buscar benefício por ID

### Request

```http
GET http://localhost:8080/api/v1/beneficios/1
```

### 📷 Evidência esperada

```md
![GET Beneficios](docs/images/postman-get-beneficio-por-id.png)
```

---

## ➕ Criar benefício

### Request

```http
POST http://localhost:8080/api/v1/beneficios
```

### Headers

```text
Content-Type: application/json
```

### Body

```json
{
  "nome": "Vale Alimentação",
  "descricao": "Benefício mensal",
  "valor": 500.00,
  "ativo": true
}
```

### 📷 Evidência esperada

```md
![POST Beneficio](docs/images/postman-post-beneficio.png)
```

---

## ✏️ Atualizar benefício

### Request

```http
PUT http://localhost:8080/api/v1/beneficios/3
```

### Body

```json
{
  "nome": "Vale Refeição",
  "descricao": "Benefício atualizado",
  "valor": 750.00,
  "ativo": true
}
```

### 📷 Evidência esperada

```md
![PUT Beneficio](docs/images/postman-put-beneficio.png)
```

---

## ❌ Remover benefício

### Request

```http
DELETE http://localhost:8080/api/v1/beneficios/3
```

### 📷 Evidência esperada

```md
![DELETE Beneficio](docs/images/postman-delete-beneficio.png)
```

---

## 💸 Transferência entre benefícios

### Request

```http
POST http://localhost:8080/api/v1/beneficios/transferencias
```

### Body

```json
{
  "fromId": 1,
  "toId": 2,
  "amount": 100.00
}
```

### 📷 Evidência esperada

```md
![Transferencia](docs/images/postman-transferencia.png)
```

---

# ✅ Scripts executados automaticamente

Os scripts abaixo são executados automaticamente na inicialização da aplicação:

- `db/schema.sql`
- `db/seed.sql`

---

# 📷 Evidência - Inicialização da aplicação

> Inserir print do log do Spring Boot mostrando execução do banco.

### Exemplo

```md
![Spring Boot Startup](docs/images/startup.png)
```

---

# 🛠️ Tecnologias utilizadas

- Java 17
- Spring Boot 3
- Spring Data JPA
- H2 Database
- Swagger / OpenAPI
- Maven
- Angular
- EJB
- JUnit / Mockito

---

# ✅ Melhorias implementadas

- Arquitetura em camadas
- CRUD completo
- Integração Backend + EJB
- Controle transacional
- Locking pessimista
- Tratamento de exceções
- Execução automática de scripts SQL
- Documentação Swagger
- Testes automatizados
- README detalhado