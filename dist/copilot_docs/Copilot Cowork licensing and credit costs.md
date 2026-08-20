---
id: 202608200920
tags: []
---

# Copilot Cowork licensing and credit costs

What the Cost management page in the Microsoft 365 admin centre actually means for a tenant that already holds Copilot premium seats, and what a Cowork task costs to run. Written 20 August 2026 from the WorkSmart-AI tenant's own admin centre. Product facts sourced from Microsoft Learn, cost figures from partners running it in production. Part of [[_worksmart-ai]]. Sits alongside [[Copilot glossary for business users]] and [[Copilot for business users - official Microsoft sources]].

## The headline

**Holding Microsoft 365 Copilot licences does not entitle you to Cowork.** The licence is a prerequisite for access, but it carries zero Cowork entitlement. Cowork task execution is metered separately in Copilot Credits, on top of the ~£24/$30 per user per month seat.

This is a genuine break from how the rest of Copilot is sold, and it is the thing clients will get wrong. Copilot Chat and the in-app experiences are covered by the seat. Cowork is not.

## Reading the Cost management page

The page lives at **M365 admin centre → Copilot → Cost management**. It currently governs Cowork and the Work IQ API only; everything else pay-as-you-go stays in classic Billing & usage.

| What it shows                                          | What it means                                                                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| "Unlock AI experiences enabled by usage-based billing" | Usage-based billing has never been activated. Nobody in the tenant can run a Cowork task                                      |
| "_N_ pending requests" on the Cowork card              | Licensed users have already hit Cowork in-app and asked for access. They queue here until billing is on and an admin approves |
| Overview tab                                           | Real-time credit consumption and remaining capacity                                                                           |
| Consumption tab                                        | Drill-down by user, group, service or agent - this is where you find the heavy users                                          |

The pending-request state happens when an admin has made Cowork _discoverable_ to end users without enabling billing. Discovery and billing are separate switches.

## Turning it on

1. **Get started** on the Cost management page, which opens the spending-policy panel
2. Choose the billing model: prepaid credits (P3), pay-as-you-go, or existing capacity
3. Connect an Azure subscription - required, and the usual blocker
4. Define a spending policy: who may consume, how much, and where the limits apply
5. Set a hard cap and alerts before approving anyone
6. Approve the pending requests

Needs Global or Billing admin. About 10 to 15 minutes if the Azure subscription already exists; longer if one has to be created and a payment method attached.

## What a task costs

Microsoft publishes **no per-task rate**. Cost is driven by the model used, how much organisational context is retrieved, how many tools are called, and how long the task runs. Context retrieval, not the model, dominates the bill.

Partner-reported figures, at $0.01 per credit:

| Task type | Example                                              | Credits | Cost   |
| --------- | ---------------------------------------------------- | ------- | ------ |
| Light     | Quick brief from a few files                         | ~125    | ~$1.25 |
| Medium    | Multi-step grounded research memo                    | ~500    | ~$5    |
| Heavy     | Long-running multi-tool orchestration, large context | ~1,200  | ~$12   |

Per-user monthly estimates: around **$120** for a manager profile, **$400+** for a heavy technical user - on top of the seat. A tenant of 20 mixed users could plausibly run $2,000 to $4,000 a month in credits alone.

Treat these as indicative. They come from partner blogs, not Microsoft. A task grounded across Work IQ, Fabric and Dynamics costs far more than the same prompt run against three files.

## Getting a real number

- **Customer Cowork Estimator** - Microsoft's own modelling tool: https://aka.ms/CustomerCoworkEstimator
- **`/cost` inside Cowork** - returns the exact credits a session consumed. Run two or three representative tasks under a low cap and build a house baseline from actual sessions rather than a vendor's averages

## Why this matters for WorkSmart-AI

Three things worth carrying into client conversations:

- **The seat is not the bill.** Any client planning Cowork rollout on the assumption their Copilot licences cover it will be wrong by a factor that scales with usage. Worth raising unprompted in the Copilot Chat to 365 Copilot and Intermediate to Advanced Copilot courses
- **Cost control is an admin skill, not a user skill.** Spending policies, caps and the Consumption tab are a legitimate senior-leader topic - fits the AI Strategic Roadmap workshop better than any user-facing course
- **Prompt economy has a price tag now.** "Retrieve less context" stops being a quality tip and becomes a budget line. That is a teachable, and it is new

## Sources

- [Usage-based billing and cost management for Copilot Credits](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits) - Microsoft Learn, updated 13 August 2026
- [Managing AI experiences enabled by usage-based billing](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-manage-copilot-credits) - Microsoft Learn
- [Manage Copilot Cowork for your organization](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-admin-governance) - Microsoft Learn
- [Microsoft Copilot Credits licensing guidance](https://www.microsoft.com/licensing/guidance/Copilot-Credits)
- [Quisitive - Copilot Cowork pricing 2026](https://quisitive.com/copilot-cowork-pricing-2026-how-usage-based-billing-works/) - task cost bands
- [Seepath - Cowork credits and cost control](https://www.seepath.com/blog/copilot-cowork-credits-how-to-control-spend)
- [A Guide to Cloud & AI - Cowork pricing and cost management](https://www.aguidetocloud.com/blog/microsoft-copilot-cowork-pricing-cost-management/) - per-user monthly profiles
