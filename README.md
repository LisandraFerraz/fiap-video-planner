# YouTube Vídeo Planner 🎥📅

Challenge proposto do fim do módulo "Javascript Avançado", no curso Front-End Engineering da FIAP.

O objetivo é organizar os vídeos encontrados após pesquisa por palavra-chave em cada um dos sete dias mapeados no topo do layout.

- O usuário deve informar quantos minutos tem por dia para assistir aos vídeos;
- O tempo total que o usuário vai gastar assistindo não pode passar do limite estipulado pelo mesmo em cada dia.

![project-overview](https://github.com/user-attachments/assets/496b941a-f312-4c91-b3e4-d923f15ee391)

## Rodando localmente

1. Clone o repositório;
2. Acesse o [console Google](https://console.cloud.google.com/) e crie um novo projeto;
3. Crie uma chave de acesso e instale a API do YouTube no projeto;
4. Crie um arquivo na pasta "utils" chamado "\_api-key.js" com o seguinte conteudo:
   ```
   const YT_API_KEY = "SUA_CHAVE_DE_ACESSO"
   ```
5. Instale a extensão "Live Server" para o VSCode (ou a IDE que estiver usando);
6. Ative a extensão e teste o projeto.
