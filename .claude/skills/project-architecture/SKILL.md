---
name: project-architecture
description: Arquitetura e convenções obrigatórias deste frontend Next.js (camadas app→features→ui/lib, design system, lib/api, Server vs Client). Use SEMPRE que for criar, mover ou refatorar arquivos/pastas, scaffolding de feature, componente, chamada de API, ou decidir onde algo vive. Consulte ANTES de escrever código.
---

# Arquitetura & Convenções do projeto

Regras para qualquer dev (humano ou agente) que tocar neste projeto.
**Não inventar estrutura nova. Não "melhorar" a organização por conta própria.**
Seguir exatamente o que está descrito aqui. Na dúvida, perguntar antes de criar pasta.

Fonte de verdade completa: `ARQUITETURA.md` na raiz do repositório. Esta Skill é o resumo operacional — em conflito, vale `ARQUITETURA.md`.

## 1. Princípio único (manda em todas as outras)

A dependência flui em UMA direção só:

```
app/  →  features/  →  ui/ + lib/
```

Camada de baixo NUNCA importa de camada de cima.

- `ui/` não importa de `features/` nem de `lib/api/`.
- `lib/` não importa de `features/` nem de `app/`.
- `features/` pode usar `ui/` e `lib/`.
- `app/` orquestra: só monta páginas com `features/`.
- Uma `feature` NÃO importa de outra feature direto — o contrato compartilhado sobe pra `lib/`.

Se um arquivo precisa quebrar essa direção, ele está no lugar errado. **Mover, não contornar.**

> **Estrutura deste projeto:** SEM prefixo `src/`. As pastas `app/`, `ui/`, `lib/`, `features/` ficam na raiz do projeto. Imports usam o alias `@/*` (mapeado para `./*` no `tsconfig.json`): `@/ui/...`, `@/lib/...`, `@/features/...`. O App Router já existe em `app/`.

## 2. Onde cada coisa vive

| O que é                                   | Onde vai                         |
|-------------------------------------------|----------------------------------|
| Rota / página                             | `app/.../page.tsx`               |
| Layout de rota                            | `app/.../layout.tsx`             |
| Chamada à API Node (fetch/mutation)       | `lib/api/<recurso>.ts`           |
| Cliente base da API (baseURL/headers/auth)| `lib/api/client.ts`              |
| Token visual (cor, espaço, fonte)         | `ui/tokens/`                     |
| Componente burro reutilizável (Button...) | `ui/primitives/`                 |
| Composição genérica (FormField, Modal)    | `ui/patterns/`                   |
| Componente que conhece o domínio          | `features/<feature>/components/` |
| Hook de domínio                           | `features/<feature>/hooks/`      |
| Estado de domínio (store)                 | `features/<feature>/store.ts`    |
| Tipo de domínio                           | `features/<feature>/types.ts`    |
| Util genérico (sem domínio)               | `lib/utils/`                     |
| Config / env                              | `lib/config.ts`                  |

## 3. Regras invioláveis (NUNCA)

1. **Lógica de API nunca dentro de componente.** Nenhum `fetch`/axios/gateway dentro de `.tsx`. Todo acesso à API Node vive em `lib/api/`; o componente chama uma função de lá.
2. **Componente em `ui/` nunca conhece domínio.** Se menciona uma entidade do negócio (pedido, produto, clima...), pertence a `features/`, não a `ui/`.
3. **Nenhuma chave/segredo no client.** Tokens/secrets só no servidor (Server Component, Server Action ou rota `app/api/`).
4. **Nada de pasta `components/` solta na raiz.** Componente ou é design system (`ui/`) ou é de feature (`features/<x>/components/`). Não existe terceiro lugar.
5. **Cor/espaçamento/fonte hardcoded é proibido.** Sempre via token (`ui/tokens/`) ou classe do tema. Nada de `#fff` ou `margin: 13px` no JSX.
6. **Server Action para mutação, nunca fetch no client pra escrever.** Mutações passam por Server Action → `lib/api/`.

## 4. Design system (`ui/`)

- Três níveis, nessa ordem: `tokens/` → `primitives/` → `patterns/`.
  - `tokens/`: fonte única de cor, espaço, tipografia, raio, sombra.
  - `primitives/`: tijolos burros (Button, Input, Card, Sheet, Badge, Skeleton).
  - `patterns/`: composições genéricas de primitivos (FormField = label+input+erro).
- Primitivo: sem regra de negócio, sem fetch, sem estado global. Aceita `className` e faz forward das props nativas do elemento.
- Acessibilidade não é opcional: usar Radix por baixo quando houver interação (Dialog, Sheet, Dropdown, Tooltip).
- Só entra em `ui/` o que serve a QUALQUER projeto sem alteração. Carregou nome de entidade do negócio → vai pra `features/`.

## 5. Features (`features/`)

- Uma pasta por área de domínio (ex.: `cart/`, `catalog/`, `checkout/`).
- Estrutura interna padrão:
  ```
  features/<x>/
  ├── components/   # UI que conhece o domínio
  ├── hooks/        # ex: useCart
  ├── store.ts      # estado (Zustand) — só se a feature tiver estado próprio
  └── types.ts      # tipos do domínio dessa feature
  ```
- Feature compõe primitivos de `ui/` — não recria botão/input/etc.

## 6. Dados / API (`lib/api/`)

- Um arquivo por recurso (`products.ts`, `orders.ts`...). Cada função retorna dado tipado ou lança erro. Sem tratar UI aqui.
- Cliente base único `client.ts` cuida de baseURL, headers e auth.
- **Leitura**: fetch em Server Component com `next: { revalidate, tags }`.
- **Escrita**: Server Action chamando `lib/api/`, depois `revalidateTag`.
- Dado dinâmico autenticado no client: TanStack Query, nunca `fetch` solto em `useEffect`.

## 7. Server vs Client Components

- Default é Server Component. Só `"use client"` quando precisar de estado local, evento de browser, hook de client (useState/useEffect) ou lib que exige DOM.
- `"use client"` o mais fundo possível na árvore — não marcar a página inteira por causa de um botão.

## 8. Nomenclatura

- Componentes: `PascalCase` (arquivo e export) — `CartItem.tsx`.
- Hooks: `camelCase` com `use` — `useCart.ts`.
- Funções de API: verbo + recurso — `getOrders`, `createOrder`.
- Tipos de domínio: `PascalCase` no `types.ts` da feature — `Order`.
- Pastas: `kebab-case` — `order-tracking/`.
- Barrel (`index.ts`) só em `ui/`. Não criar barrel em feature.

## 9. Checklist antes de criar um arquivo novo

1. Isso é design system (reutilizável, sem domínio) ou feature (tem domínio)?
2. Faz acesso a dado → vai pra `lib/api/`, não pro componente.
3. Estou importando "pra cima" na direção das camadas? Se sim, parei e repensei.
4. Estou hardcodando cor/espaço? Se sim, usei token.
5. Precisa mesmo ser `"use client"`? Se não, deixei Server Component.

## ⚠️ Antes de escrever código Next.js

Este projeto usa uma versão do Next.js com **breaking changes** vs. o conhecimento padrão. Ler o guia relevante em `node_modules/next/dist/docs/` antes de escrever código de rota/Server Action/cache. Respeitar avisos de deprecação.
