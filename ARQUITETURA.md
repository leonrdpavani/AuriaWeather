# Arquitetura & Convenções — Frontend (Next.js + API Node)

Regras para qualquer dev (humano ou agente) que tocar neste projeto.
Não inventar estrutura nova. Não "melhorar" a organização por conta própria.
Seguir exatamente o que está descrito aqui. Na dúvida, perguntar antes de criar pasta.

---

## 1. Princípio único (a regra que manda em todas as outras)

A dependência flui em UMA direção só:

```
app/  →  features/  →  ui/ + lib/
```

Camada de baixo NUNCA importa de camada de cima.

- `ui/` não importa de `features/` nem de `lib/api/`.
- `lib/` não importa de `features/` nem de `app/`.
- `features/` pode usar `ui/` e `lib/`.
- `app/` orquestra: só monta páginas com `features/`.

Se um arquivo precisa quebrar essa direção, ele está no lugar errado. Mover, não contornar.

---

## 2. Onde cada coisa vive

| O que é                                   | Onde vai                          |
|-------------------------------------------|-----------------------------------|
| Rota / página                             | `src/app/.../page.tsx`            |
| Layout de rota                            | `src/app/.../layout.tsx`          |
| Chamada à API Node (fetch/mutation)       | `src/lib/api/<recurso>.ts`        |
| Token visual (cor, espaço, fonte)         | `src/ui/tokens/`                  |
| Componente burro reutilizável (Button...) | `src/ui/primitives/`              |
| Composição genérica (FormField, Modal)    | `src/ui/patterns/`                |
| Componente que conhece o domínio          | `src/features/<feature>/components/` |
| Hook de domínio                           | `src/features/<feature>/hooks/`   |
| Estado de domínio (store)                 | `src/features/<feature>/store.ts` |
| Tipo de domínio                           | `src/features/<feature>/types.ts` |
| Util genérico (sem domínio)               | `src/lib/utils/`                  |
| Config / env                              | `src/lib/config.ts`               |

---

## 3. Regras invioláveis (NUNCA)

1. **Lógica de API nunca dentro de componente.** Nenhum `fetch`, axios, ou
   chamada de gateway dentro de `.tsx` de componente. Todo acesso à API Node
   vive em `src/lib/api/`. O componente chama uma função de lá.

2. **Componente em `ui/` nunca conhece domínio.** `ui/` não sabe o que é
   "pedido", "produto", "pagamento". Se um componente menciona uma entidade do
   negócio, ele pertence a `features/`, não a `ui/`.

3. **Nenhuma chave/segredo no client.** Token de gateway, secret de PSP, etc.
   só no servidor (Server Component, Server Action ou rota `app/api/`).

4. **Nada de pasta `components/` solta na raiz.** Componente ou é design system
   (`ui/`) ou é de feature (`features/<x>/components/`). Não existe terceiro lugar.

5. **Cor/espaçamento/fonte hardcoded é proibido.** Sempre via token
   (`ui/tokens/`) ou classe do tema. Nada de `#fff` ou `margin: 13px` no JSX.

6. **Server Action para mutação, nunca fetch no client pra escrever.** Criar
   pedido, iniciar pagamento, etc. passam por Server Action → `lib/api/`.

---

## 4. Design system (`ui/`)

- Três níveis, nessa ordem de composição:
  - `tokens/` → fonte única de cor, espaço, tipografia, raio, sombra.
  - `primitives/` → tijolos burros (Button, Input, Card, Sheet, Badge, Skeleton).
  - `patterns/` → composições genéricas de primitivos (FormField = label+input+erro).
- Primitivo não tem regra de negócio, não faz fetch, não tem estado global.
- Todo primitivo aceita `className` e faz forward de props nativas do elemento.
- Acessibilidade não é opcional: usar Radix por baixo quando houver interação
  (Dialog, Sheet, Dropdown, Tooltip).
- Um componente só entra em `ui/` se puder ser usado em QUALQUER projeto sem
  alteração. Se carrega o nome de uma entidade do negócio, vai pra `features/`.

---

## 5. Features (`features/`)

- Uma pasta por área de domínio: `cart/`, `catalog/`, `checkout/`, `order-tracking/`.
- Estrutura interna padrão de cada feature:
  ```
  features/<x>/
  ├── components/   # UI que conhece o domínio (ex: CartItem, PaymentSummary)
  ├── hooks/        # ex: useCart
  ├── store.ts      # estado (Zustand) — só se a feature tiver estado próprio
  └── types.ts      # tipos do domínio dessa feature
  ```
- Uma feature pode importar de `ui/` e `lib/`. Não importa de outra feature
  diretamente — se precisa, o tipo/contrato compartilhado sobe pra `lib/`.
- Componente de feature compõe primitivos de `ui/`. Não recria botão, input, etc.

---

## 6. Dados / API (`lib/api/`)

- Um arquivo por recurso: `products.ts`, `orders.ts`, `payments.ts`.
- Toda função aqui retorna dado tipado ou lança erro. Sem tratar UI aqui.
- Cliente base único (`client.ts`) cuida de baseURL, headers e auth.
- **Leitura** (catálogo, produto): fetch em Server Component, com
  `next: { revalidate, tags }` para cache.
- **Escrita** (criar pedido, pagar): Server Action chamando `lib/api/`, depois
  `revalidateTag`.
- Dado dinâmico autenticado no client (status do pedido, "meus pedidos"):
  TanStack Query, nunca fetch solto no `useEffect`.

---

## 7. Server vs Client Components

- Default é Server Component. Só marca `"use client"` quando precisar de:
  estado local, evento de browser, hook de client (useState, useEffect), ou lib
  que exige DOM.
- `"use client"` o mais fundo possível na árvore. Não marcar a página inteira
  como client só porque um botão precisa.
- Carrinho e checkout são interativos → client. Catálogo e página de produto →
  server.

---

## 8. Nomenclatura

- Componentes: `PascalCase` (arquivo e export). `CartItem.tsx`.
- Hooks: `camelCase` começando com `use`. `useCart.ts`.
- Funções de API: verbo + recurso. `getOrders`, `createOrder`, `startPayment`.
- Tipos de domínio: `PascalCase`, no `types.ts` da feature. `Order`, `CartLine`.
- Pastas: `kebab-case`. `order-tracking/`.
- Barrel (`index.ts`) só em `ui/` para reexport. Não criar barrel em feature
  (atrapalha tree-shaking e cria import circular fácil).

---

## 9. Checklist antes de criar um arquivo novo

1. Isso é design system (reutilizável, sem domínio) ou feature (tem domínio)?
2. Se faz acesso a dado → vai pra `lib/api/`, não pro componente.
3. Estou importando "pra cima" na direção das camadas? Se sim, parei e repensei.
4. Estou hardcodando cor/espaço? Se sim, usei token.
5. Precisa mesmo ser `"use client"`? Se não, deixei Server Component.
