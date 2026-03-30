# Sauce Demo Coverage Gap Matrix

## Current Critical Flows Covered
- Product discovery and product detail navigation
- Add-to-cart and cart pricing checks
- Checkout progression to payment step
- Authenticated purchase history visibility
- Authentication precondition in `beforeEach` for e2e suite

## Highest-Impact Gaps (Prioritized)
1. Authentication lifecycle (`logout` and session continuity)
2. Cart mutation robustness (remove item, quantity changes)
3. Checkout required-field gate (payment must stay blocked)
4. Backend add-to-cart confirmation (`/cart/add.js` success)
5. Negative-path validations on checkout input constraints

## Implemented in This Iteration
- `tests/e2e/logout-relogin.spec.ts`
- `tests/e2e/cart-remove-item.spec.ts`
- `tests/e2e/cart-quantity-update.spec.ts`
- `tests/e2e/checkout-required-fields.spec.ts`
- `tests/e2e/add-to-cart-backend.spec.ts`

## Remaining To Reach Near-Complete Confidence
- Invalid login and explicit auth error messaging coverage
- Search zero-result behavior and sold-out edge cases
- Cross-browser matrix (`chromium`, `firefox`, `webkit`)
- Mobile viewport projects
- Visual regression snapshots for header/cart/checkout
- Accessibility-focused checks for keyboard and focus order
