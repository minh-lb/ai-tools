# Coding Rules: SOLID

> Read with `clean-code.md`. Encapsulation/immutability/anemic-model/Tell-Don't-Ask/primitive-obsession/static-state rules (not covered by SOLID itself) are in `oop.md`.

## 1. SRP — one reason to change
- Signs: generic names (`Manager`, `Helper`, `Util`); methods mixing steps at different abstraction levels (validate + calculate + email + log).
- Thresholds: 3+ unrelated concerns in one class/method; constructor with >5-7 dependencies; a method touching more than one of {validation, business calc, I/O, presentation}.
- Fix: split by responsibility (Laravel: controller coordinates → Form Request validates → Service/Action does logic → Job/Mailable emails).
- Don't over-fragment into functions that just call each other — group by actual reason for change.

## 2. OCP — open for extension, closed for modification
- Signs: `if/else`/`switch` on `type`/`status` repeated across 2+ places.
- Fix: polymorphism/strategy map instead:
  ```ts
  interface PaymentStrategy { pay(amount: number): void; }
  const strategies: Record<string, PaymentStrategy> = { card: new CardPayment(), momo: new MomoPayment() };
  strategies[paymentType].pay(amount);
  ```
- Don't preempt: no strategy pattern for logic used in exactly one place (YAGNI).

## 3. LSP — subtype must be substitutable
- Signs: subclass throws "not supported," requires stricter input, or returns less than the base promises. Treat as a bug (runtime failure risk), not style.
- Fix: split into smaller interfaces or use composition instead of forcing inheritance.

## 4. ISP — small, focused interfaces
- Signs: a `Repository` with 20 methods forcing stub/no-op implementations. Threshold: >5-7 methods with any implementation leaving some unimplemented → split.
- Fix: split by behavior group (`Readable`, `Writable`).

## 5. DIP — depend on abstractions
- Signs: a Service directly `new`s a concrete class (`new MysqlUserRepository()`), blocking mocking.
- Applies to: DB/ORM, HTTP clients, filesystem, payment gateways — anything slow/non-deterministic/networked MUST be behind an injected interface.
- Fix: constructor injection:
  ```php
  class OrderService
  {
      public function __construct(private readonly PaymentGatewayInterface $gateway) {}
  }
  ```
  Laravel: bind interface→implementation in the Service Container, don't `new` inline.

## 6. Law of Demeter
Talk only to immediate collaborators — no reaching through them (`$order->customer->address->city->name`, `a.b.c.d.method()`). Fix: expose a method on the immediate collaborator (`$order->getBillingCityName()`), or pass only the needed data.

## 7. Composition over inheritance (hard limit)
Inheritance MUST NOT exceed 2 levels — 3rd level needed → switch to composition/interfaces.

## Quick review checklist
1. Single reason to change? (SRP)
2. Type-based if/switch that should be polymorphism? (OCP)
3. Subclass fully substitutable without unexpected failures? (LSP)
4. Bloated interface forcing stub methods? (ISP)
5. Depends on concrete class instead of interface? (DIP)
6. Chain reaching more than one object deep? (Demeter)
7. Inheritance 3+ levels deep? (Composition)
