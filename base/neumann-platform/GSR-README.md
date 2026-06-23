<<<<<<< HEAD
# 🧠 Monitor GSR - Integração Neumann Platform

Esta integração conecta o protótipo de monitoramento GSR (Galvanic Skin Response) com a plataforma Neumann Dashboard.

## ⚡ Como usar

### 1. Iniciar o servidor GSR/MQTT

```bash
npm run gsr-server
```

### 2. Iniciar a aplicação Next.js

```bash
npm run dev
```

### 3. Acessar o Monitor GSR

- Abra o navegador em `http://localhost:3000`
- Navegue para "GSR Monitor" no menu lateral
- O sistema conectará automaticamente ao ESP32 via WebSocket/MQTT

## 📊 Funcionalidades

### Monitoramento em Tempo Real

- **Condutância da pele** (µS)
- **Resistência** (kΩ)
- **Estado emocional** baseado nos valores GSR
- **Gráfico temporal** dos dados coletados

### Controles do ESP32

- 💡 **Ligar LED**
- 🔌 **Desligar LED**
- ⚡ **Piscar LED** (vários padrões)
- 📊 **Atualizar dados**

### Estados Emocionais

- 😴 **Muito Relaxado** - GSR muito baixo
- 😊 **Relaxado** - GSR baixo
- 😐 **Normal** - GSR médio
- 😰 **Ativado** - GSR alto
- 😨 **Estressado** - GSR muito alto

## 🔧 Configuração Técnica

### Servidor MQTT/WebSocket

- **Porta WebSocket:** 8080
- **Broker MQTT:** broker.hivemq.com
- **Tópicos:**
  - Dados: `neumann/gsr/lovelace/data`
  - Comandos: `neumann/gsr/lovelace/commands`

### ESP32 (Configuração esperada)

O ESP32 deve estar configurado para:

1. Conectar ao broker MQTT `broker.hivemq.com`
2. Publicar dados JSON no tópico `neumann/gsr/lovelace/data`
3. Escutar comandos no tópico `neumann/gsr/lovelace/commands`

### Formato dos Dados JSON

```json
{
  "conductance": 12.5,
  "resistance": 80000,
  "emotion": "relaxed",
  "led_enabled": true,
  "led_pattern": 3
}
```

## 🚀 Próximos Passos

1. **Calibração automática** dos limites emocionais
2. **Histórico de dados** com banco de dados
3. **Alertas e notificações** baseados em padrões
4. **Integração com outros wearables** da plataforma
5. **Dashboard comparativo** de múltiplos usuários

## 📝 Logs e Debug

O sistema mantém logs detalhados de:

- Conexões WebSocket
- Mensagens MQTT recebidas/enviadas
- Comandos executados
- Erros de conexão

Use os botões "Limpar Log" e "Reconectar" na interface para debug.
=======
# 🧠 Monitor GSR - Integração Neumann Platform

Esta integração conecta o protótipo de monitoramento GSR (Galvanic Skin Response) com a plataforma Neumann Dashboard.

## ⚡ Como usar

### 1. Iniciar o servidor GSR/MQTT

```bash
npm run gsr-server
```

### 2. Iniciar a aplicação Next.js

```bash
npm run dev
```

### 3. Acessar o Monitor GSR

- Abra o navegador em `http://localhost:3000`
- Navegue para "GSR Monitor" no menu lateral
- O sistema conectará automaticamente ao ESP32 via WebSocket/MQTT

## 📊 Funcionalidades

### Monitoramento em Tempo Real

- **Condutância da pele** (µS)
- **Resistência** (kΩ)
- **Estado emocional** baseado nos valores GSR
- **Gráfico temporal** dos dados coletados

### Controles do ESP32

- 💡 **Ligar LED**
- 🔌 **Desligar LED**
- ⚡ **Piscar LED** (vários padrões)
- 📊 **Atualizar dados**

### Estados Emocionais

- 😴 **Muito Relaxado** - GSR muito baixo
- 😊 **Relaxado** - GSR baixo
- 😐 **Normal** - GSR médio
- 😰 **Ativado** - GSR alto
- 😨 **Estressado** - GSR muito alto

## 🔧 Configuração Técnica

### Servidor MQTT/WebSocket

- **Porta WebSocket:** 8080
- **Broker MQTT:** broker.hivemq.com
- **Tópicos:**
  - Dados: `neumann/gsr/lovelace/data`
  - Comandos: `neumann/gsr/lovelace/commands`

### ESP32 (Configuração esperada)

O ESP32 deve estar configurado para:

1. Conectar ao broker MQTT `broker.hivemq.com`
2. Publicar dados JSON no tópico `neumann/gsr/lovelace/data`
3. Escutar comandos no tópico `neumann/gsr/lovelace/commands`

### Formato dos Dados JSON

```json
{
  "conductance": 12.5,
  "resistance": 80000,
  "emotion": "relaxed",
  "led_enabled": true,
  "led_pattern": 3
}
```

## 🚀 Próximos Passos

1. **Calibração automática** dos limites emocionais
2. **Histórico de dados** com banco de dados
3. **Alertas e notificações** baseados em padrões
4. **Integração com outros wearables** da plataforma
5. **Dashboard comparativo** de múltiplos usuários

## 📝 Logs e Debug

O sistema mantém logs detalhados de:

- Conexões WebSocket
- Mensagens MQTT recebidas/enviadas
- Comandos executados
- Erros de conexão

Use os botões "Limpar Log" e "Reconectar" na interface para debug.
