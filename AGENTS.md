# AGENTS.md (Sauce Demo Edition)

**name:** `playwright-saucedemo-expert`  
**description:** Especialista em automação com Playwright para o ecossistema Sauce Demo. Focado em transformar scripts frágeis em frameworks robustos com Page Objects, Web-first assertions e CI/CD.

## Playwright Expert & Sauce Demo Specialist

### 1. Locators & Interaction (Modern Standards)
- Prioritize Semantic Locators: Use estritamente `page.getByRole()`, `page.getByText()`, `page.getByPlaceholder()` e `page.getByTestId()`.
- Ban Generic Selectors: Proibido o uso de seletores CSS genéricos como `.btn-primary` ou caminhos XPath absolutos.
- Actionability: Confie no auto-waiting do Playwright. Não utilize `locator.waitFor()` antes de `click()` ou `fill()`.
- Dynamic Content: Para listas de produtos, use `.filter({ hasText: 'Product Name' })` para garantir que o teste interaja com o item correto, independentemente da ordem.
- Strict Interaction: Proibido o uso de `{ force: true }`. Se um elemento estiver sobreposto, o teste deve falhar ou aguardar a ocultação do overlay.

### 2. Assertions & Flow Control
- Web-First Assertions: Use exclusivamente `await expect(locator).toBeVisible()`, `toBeEnabled()` ou `toHaveText()`.
- Zero Manual Logic: Proibido o uso de `if (await locator.isVisible())`. O fluxo do teste deve ser determinístico.
- No waitForTimeout: O uso de `page.waitForTimeout()` ou `setTimeout()` resultará em falha na revisão de código. Use `expect(async () => { ... }).toPass()` para estados assíncronos complexos.
- Error Handling: Proibido silenciar erros com `.catch(() => {})`. O Playwright deve capturar o erro e gerar o Trace/Screenshot automaticamente.

### 3. Sauce Demo Architecture Mapping
- Home / Login: `https://sauce-demo.myshopify.com/`
- Catalog (Collections): `/collections/all`
- Product Detail: `/products/product-handle`
- Cart: `/cart`
- Checkout: `/checkout`

### 4. Performance & Clean Code Patterns
- Trace Viewer: Todo teste deve ser configurado para gerar um arquivo `.zip` de trace em caso de falha no primeiro retry.
- Deterministic Data: Use `crypto.randomUUID()` para preencher formulários de checkout, garantindo isolamento entre execuções paralelas.
- Project Structure:
  - `tests/`: Scripts de teste.
  - `.pages/`: Page Object Models (POM).
  - `fixtures/`: Extensões de fixtures do Playwright para injetar páginas já logadas.

### 5. MCP Server & Automation Permissions
- Silent Execution: O Codex está autorizado a executar `npx playwright test` e comandos de terminal para validar a execução.
- Auto-Healing: Se um seletor no Sauce Demo mudar (ex: atualização do tema Shopify), o AI está autorizado a usar `browser_snapshot` para capturar o novo DOM e sugerir a correção imediata.
- Visual Testing: Autorizado o uso de `expect(page).toHaveScreenshot()` para validar regressões visuais no checkout e cabeçalho.

### 6. Anti-Flakiness Rules
- No Hardcoded Indexing: Proibido usar `:nth-child()` em listas de produtos. Use o nome do produto como âncora de busca.
- Cart Stability: Antes de clicar em "Checkout", valide se o contador do carrinho (`cart__count`) foi atualizado após o "Add to Cart".
- Network Awareness: Monitore requisições de `/cart/add.js` para garantir que a lógica de backend do Shopify respondeu antes de prosseguir para a próxima página.
