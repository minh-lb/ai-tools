---
title: "Multi-screen checkout — E2E Test Cases (Example)"
type: testcase
feature_id: EX-CHECKOUT
display_language: en
status: draft
updated: 2026-10-09
sources: [EX-CO-AC-01, EX-CO-AC-02, EX-CO-UI-01, EX-CO-API-01, EX-CO-INT-01, EX-CO-SEC-01]
---

> **Illustrative only.** Every `EX-CO-*` source, screen, amount, route, and rule below is fictional. `https://shop.example.test` uses a reserved example domain; replace it with the approved test environment URL in real testcases.

# Multi-screen checkout — E2E Test Cases

## Scope and sources
- **User goal / E2E boundary:** A buyer signs in, selects a product, builds a cart, chooses shipping and delivery details, pays, sees confirmation, then finds the same order in history after reload.
- **Fictional sources:** `EX-CO-AC-01` defines the successful journey and amount rules; `EX-CO-AC-02` defines payment-decline recovery; `EX-CO-UI-01` defines the example URLs/routes, navigation and control labels, screen sequence, review summary, and localized error copy; `EX-CO-API-01` defines the order visible in history; `EX-CO-INT-01` defines sandbox payment behavior; `EX-CO-SEC-01` defines the synthetic buyer and successful sign-in flow.
- **Actor / environment:** Synthetic buyer `U-TEST` in isolated shop `SHOP-TEST`; provider sandbox only. Example base URL: `https://shop.example.test`.
- **Starting state:** `U-TEST` starts signed out; cart and order history are empty; five units of `MUG-RED` are in stock. Reset before each case.
- **Shared test data:** Product price $24.00 each; `SAVE10` gives 10% off the item subtotal; saved address `ADDR-TEST-01`; Standard delivery costs $5.00; test tenant is tax-exempt ($0 tax); sandbox tokens `CARD-OK` and `CARD-DECLINE`.
- **Cleanup / safety:** Use no real card or address. After each case, verify evidence, void/refund the sandbox capture if required, remove the test order/cart, and restore inventory using the approved fixture. Never run against live commerce or payment systems.
- **Out of scope:** Other currencies, addresses, delivery tiers, expired/invalid coupons, stock-out, cancellation/refund workflows, concurrent checkout, and live provider behavior. Link these to their dedicated suites when in scope.

## E2E scenarios

### TC-001 — Complete checkout across catalog, cart, shipping, payment, review, confirmation, and order history
- **Preconditions:** `U-TEST` exists, has buyer access, starts signed out, and the checkout fixture in Scope is reset.
- **Test data:** Approved QA credential-store alias for `U-TEST` (never copy the credential); `MUG-RED` quantity 2, `SAVE10`, `ADDR-TEST-01`, Standard delivery, and `CARD-OK`.
- **User actions:**
  1. Launch the test browser and navigate to `https://shop.example.test/sign-in`; enter `U-TEST` in **Account ID**, retrieve its password through the approved credential-store alias and enter it in **Password**, then select **Sign in**. Verify the URL `/shops/SHOP-TEST/home` and signed-in account `U-TEST`.
  2. Select **Catalog** in the shop navigation; verify `/catalog`. Focus **Search products**, enter `MUG-RED`, select the matching result, and verify `/catalog/MUG-RED` and its product details.
  3. In **Quantity**, enter `2`; select **Add to cart** and verify navigation to `/cart` with two `MUG-RED` items.
  4. In **Promo code**, enter `SAVE10`, select **Apply**, verify the $4.80 discount, then select **Continue to checkout** and verify `/checkout/address`.
  5. On **Shipping address**, select the radio option `ADDR-TEST-01`, select **Continue**, and verify `/checkout/delivery`.
  6. On **Delivery method**, select **Standard — $5.00**, select **Continue**, and verify `/checkout/payment`.
  7. On **Payment method**, select sandbox token `CARD-OK`, select **Continue**, and verify `/checkout/review`.
  8. On **Review**, verify 2 items ($48.00 subtotal − $4.80 discount + $5.00 delivery + $0 tax = $48.20); select **Place order** once.
  9. On **Confirmation**, note the order ID; select **View order**, verify `/orders/<order-id>`, then select **Order history** and verify `/orders`.
  10. Open the same order detail from **Order history**, reload `/orders/<order-id>`, and verify the displayed data again.
- **Expected outcome / postcondition (oracle):** Sign-in reaches `SHOP-TEST`. Confirmation and reloaded order details show the same order ID, two `MUG-RED` items, coupon, total $48.20, and `paid` status; order history has exactly one matching order. A read-only lookup in the approved payment sandbox finds exactly one $48.20 capture tied to that order ID.
- **Trace:** EX-CO-AC-01, EX-CO-UI-01, EX-CO-API-01, EX-CO-INT-01, EX-CO-SEC-01.
- **Risk / priority rationale:** High — financial transaction and cross-screen/cart/order consistency.

### TC-002 — Recover from a declined payment without creating a duplicate order
- **Preconditions:** `U-TEST` exists, has buyer access, starts signed out, and the checkout fixture in Scope is reset to an empty cart/order history.
- **Test data:** Approved QA credential-store alias for `U-TEST` (never copy the credential); `MUG-RED` quantity 2, `SAVE10`, `ADDR-TEST-01`, Standard delivery, and total $48.20; use `CARD-DECLINE` first, then `CARD-OK`.
- **User actions:**
  1. Launch the test browser and navigate to `https://shop.example.test/sign-in`; enter `U-TEST` in **Account ID**, retrieve its password through the approved credential-store alias and enter it in **Password**, then select **Sign in**. Verify `/shops/SHOP-TEST/home` and signed-in account `U-TEST`.
  2. Select **Catalog** in the shop navigation; verify `/catalog`. Search for `MUG-RED`, select the matching result, and verify `/catalog/MUG-RED`.
  3. Enter `2` in **Quantity**, select **Add to cart**, and verify `/cart` contains two items.
  4. Enter `SAVE10` in **Promo code**, select **Apply**, verify the $4.80 discount, then select **Continue to checkout** and verify `/checkout/address`.
  5. Select `ADDR-TEST-01` on **Shipping address**, select **Continue**, then select **Standard — $5.00** on **Delivery method** and continue to `/checkout/payment`.
  6. Select `CARD-DECLINE` on **Payment method**, select **Continue**, and verify the route `/checkout/review`.
  7. Verify the $48.20 summary on **Review** and select **Place order** once.
  8. After the decline returns the buyer to `/checkout/payment`, verify the error. In a second tab, navigate to `https://shop.example.test/orders`, reload, and confirm no order exists; return to the checkout tab.
  9. Select `CARD-OK`, select **Continue** to `/checkout/review`, and recheck the same total.
  10. Select **Place order** once; on **Confirmation**, note the order ID.
  11. Select **Order history**, open the order detail at `/orders/<order-id>`, and reload that URL.
- **Expected outcome / postcondition (oracle):** Sign-in reaches `SHOP-TEST`. After the declined attempt, the UI shows `Payment could not be authorized. Choose another method.`; no order appears and the payment sandbox has no capture. After retry with `CARD-OK`, exactly one order appears after reload with two items, total $48.20, and `paid` status; the sandbox has exactly one capture tied to that order ID.
- **Trace:** EX-CO-AC-02, EX-CO-UI-01, EX-CO-API-01, EX-CO-INT-01, EX-CO-SEC-01.
- **Risk / priority rationale:** High — recovery path must preserve cart state and avoid duplicate orders/charges.
