---
id: 202608200924
tags: []
---

# Copilot licensing decoded

Every Microsoft product called "Copilot", what each one actually is, what it costs, and what you get for it. Written 20 August 2026 as the client-facing answer to the most common question in the room: _we already pay for Copilot, why can't we do this?_ Companion to [[Copilot glossary for business users]], which defines the terms, and [[Copilot concept map for business users]], which places them in layers. The credit-billing mechanics are covered in more depth in [[Copilot Cowork licensing and credit costs]]. Part of [[_worksmart-ai]].

**Rendered handout:** https://claude.ai/code/artifact/52c66c70-6d12-4be9-a9b4-8382f66d9273

**This note is the source; the handout is the rendering.** Change the note first, then republish.

## Why everyone is confused

The confusion is not the client's fault. Four things happen at once:

1. **"Copilot" names at least nine different products**, sold on three different pricing models, some per-user, some metered, some free.
2. **The names changed, more than once.** The licence and the app formerly called Microsoft 365 Copilot are both now called Microsoft Copilot. Microsoft's own documentation carries the change as a standing note - "some experiences, licences and capabilities might continue to reference Microsoft 365 Copilot during the transition period" - so the old name is still everywhere, including on Learn pages updated this month.
3. **Free and paid share a name and a window.** Copilot Chat and the paid Copilot look nearly identical on screen. A user who has one and expects the other sees a product that is inexplicably worse than the demo.
4. **The pricing model changed under people's feet.** Until 2026 a Copilot seat covered everything. It no longer does. Cowork, custom agents and API access are metered separately in Copilot Credits, on top of the seat.

The practical consequence: **a licence is now permission to start spending, not a bill already paid.**

## The decoder

| The name you'll hear                              | What it actually is                                                                                        | How it's paid for                            |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Copilot Chat**                                  | Free AI chat for anyone with a work account. Web-grounded, enterprise data protection                      | Included with any eligible M365 subscription |
| **Microsoft Copilot** (was Microsoft 365 Copilot) | The paid seat. Copilot inside Word, Excel, PowerPoint, Outlook and Teams, grounded in your own tenant data | ~£23.10/user/month, annual                   |
| **Microsoft Copilot Business**                    | The same idea, sold against the Microsoft 365 Business plans (themselves capped at 300 seats)              | ~£13.80-£16.10/user/month                    |
| **Copilot Cowork**                                | Long-running, delegated multi-step tasks. Needs a seat, but the seat does not pay for it                   | Copilot Credits, metered                     |
| **Copilot Studio**                                | The tool for building custom agents                                                                        | Credits, or a per-user plan                  |
| **Work IQ API**                                   | The data/context layer, exposed to developers building their own agents                                    | Copilot Credits, metered                     |
| **Agent 365**                                     | Governance and security _for_ AI agents. Not an AI tool - a control plane                                  | ~$15/user/month, or bundled in E7            |
| **Security Copilot**                              | Copilot for the security operations team                                                                   | Now included in E5/E7                        |
| **GitHub Copilot**                                | Code completion for developers. Entirely separate product and bill                                         | Own subscription                             |
| **Copilot Pro / Microsoft 365 Premium**           | The _consumer_ subscription. Does not apply to work accounts                                               | Personal, per-person                         |

If a client says "we have Copilot", the useful follow-up is: **"which one, and can you see your own files in it?"**

## The three tiers that actually matter

Almost every conversation reduces to three tiers.

### Tier 0 - Copilot Chat (free)

Everyone with a work or school account on an eligible Microsoft 365 subscription already has this. No purchase, no add-on.

- AI chat grounded in **the public web**, not your organisation's files
- File uploads, image generation, Copilot Pages
- Enterprise data protection: prompts and responses are **not** used to train models
- Since the July 2026 packaging update, also gets inbox and calendar awareness plus Word, Excel and PowerPoint agents

**The limit that matters:** it does not know your organisation. It cannot answer "what did we agree in Tuesday's meeting" or "summarise this year's applications".

### Tier 1 - Microsoft Copilot (the paid seat)

- Copilot **inside** Word, Excel, PowerPoint, Outlook, Teams and OneNote
- Chat grounded in **your** tenant: your email, files, meetings, chats, via Work IQ
- Enterprise search across work data, including 100+ line-of-business connectors
- **Reasoning agents:** Researcher and Analyst - multi-step research and Python-backed data analysis. Capped at 25 combined queries per user per month
- Copilot Notebooks, Copilot Pages, Agent Mode in the Office apps
- Ability to build and use custom agents grounded in work data - but see Tier 2: building on the reasoning harness consumes credits regardless of the seat
- Copilot Analytics and the adoption dashboard for measuring rollout

**This is the tier the demos show.** It is the one people mean when they say Copilot "understands our work".

### Tier 2 - the metered layer

Bought on top of a seat, billed by consumption in Copilot Credits at **$0.01 per credit**:

- **Cowork** - delegate a long task and walk away
- **Anything built on Copilot Studio's GitHub Copilot harness** - the reasoning engine behind skills and multi-step agents
- **Custom agents** run by unlicensed users
- **Work IQ API** - your developers building against M365 context
- **SharePoint agents** and the Retrieval API for pay-as-you-go users

**The seat no longer exempts agent building.** This changed with the GitHub Copilot harness and it is now the most expensive misunderstanding in the credit model. On that harness, _"billing starts when you start building"_ - creating an agent in natural language, previewing it, testing it and generating evaluations all consume credits, before anything is published. The older standard harness still bills only after publish, and agents grounded solely in their own instructions and public websites cost nothing at all. So the honest rule is: **a licensed team can use Copilot freely, but the moment it starts building on the reasoning harness it is spending.**

Source: [Overview of usage-based billing for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/billing-credit-overview), verified 20 August 2026.

## What it costs (UK, ex VAT)

Microsoft's published UK list prices, August 2026:

| Product                                      | Annual, paid yearly       | Notes                                                                                            |
| -------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------ |
| Copilot Chat                                 | **£0**                    | Included with eligible M365 subscriptions                                                        |
| **Microsoft Copilot** (enterprise add-on)    | **£23.10** /user/month    | £24.26 if paid monthly on an annual commitment. Needs a qualifying M365 plan                     |
| **Microsoft Copilot Business** (add-on, SMB) | **£13.80** /user/month    | Promotional, from a £16.10 list. Promo runs to 30 September 2026. £19.32 on a monthly commitment |
| Business Standard **with Copilot**           | **£18.10** /user/month    | Bundle. £15.60 without Teams                                                                     |
| Business Premium **with Copilot**            | **£24.60** /user/month    | Bundle. £22.10 without Teams                                                                     |
| Copilot Credits                              | **$0.01** per credit      | Pay-as-you-go, or prepaid packs at $200/25,000 credits                                           |
| Copilot Studio credit pack                   | **$200** /month           | 25,000 credits. Below ~20,000 credits/month, pay-as-you-go is cheaper                            |
| Agent 365                                    | **$15** /user/month (USD) | Requires E5, Business Premium, or Defender + Purview                                             |

Microsoft prices credits and some SKUs in USD only; those are shown as published rather than converted.

**Watch the base licence.** The Copilot add-on is worthless without a qualifying Microsoft 365 or Office 365 plan underneath it. Those rose on 1 July 2026 - E3 from $36 to $39, E5 from $57 to $60, Business Standard from $12.50 to $14. A Copilot rollout that also forces a base-licence upgrade costs far more than the add-on price suggests.

## Education

The academic offering is real, materially cheaper, and worth naming explicitly in HE and schools conversations.

- **Microsoft Copilot for Education: $18 per user per month**, against ~$30 commercial. Roughly a 40% discount
- Available to **faculty, staff and students aged 13 and older**
- Bought through **Enrollment for Education Solutions (EES) or a CSP** - not off the website, which is why it is invisible to anyone pricing it up online
- Qualifying base plans: Microsoft 365 A1, A3, A5, or Office 365 A1, A3, A5
- **Copilot Chat is free** on A1, A3 and A5 for faculty, staff and HE students 13+

UK GBP academic pricing is not published publicly; it comes through the EES agreement or the institution's reseller. Expect the institution's procurement team to have a number nobody else in the building knows.

## Which do you actually need?

| If the goal is…                                 | You need                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Safe general AI chat, no data risk, no budget   | **Copilot Chat** - you already have it                                                           |
| "Summarise my inbox / draft from our documents" | **A paid Copilot seat.** No way round it                                                         |
| One team piloting before committing             | **Paid seats for that team only.** Licences are per-user, so a 10-person pilot is a 10-seat cost |
| A custom agent used by people without seats     | **Copilot Studio + credits**                                                                     |
| Delegating long, multi-step work                | **Seats + Cowork credits**, with a spending cap set first                                        |
| Governing agents someone else built             | **Agent 365**                                                                                    |
| Developers building on M365 data                | **Work IQ API + credits**                                                                        |

## Six traps worth naming in the room

1. **The seat does not cover Cowork - or agent building on the reasoning harness.** The most expensive misunderstanding available in 2026, and it got worse: credits now start burning while a maker is still testing an unpublished agent. Budget them separately or they arrive as a surprise invoice.
2. **Copilot Chat looks like the real thing.** Users conclude Copilot is useless when they were never given the version that reads their files. Fixing expectations is cheaper than fixing licences.
3. **Researcher and Analyst are capped at 25 queries per user per month.** Combined, not each. Heavy analytical users hit this. The cap comes from the June 2025 GA announcement and is not restated on the current Learn page, so re-check it before it goes in a proposal.
4. **The promotional prices expire.** The £13.80 Copilot Business rate runs to 30 September 2026. Build renewal at list into any business case.
5. **Base licences went up on 1 July 2026.** Price the whole stack, not the add-on.
6. **Consumer Copilot Pro is not a work licence.** Staff buying it personally get no tenant grounding and put work data somewhere IT cannot govern.

## Confidence and shelf life

Prices and packaging in this space have changed at least four times in twelve months. Treat this note as accurate to **20 August 2026** and re-verify before quoting it in a proposal.

- **High confidence** - UK prices from Microsoft's own pricing pages; licence prerequisites, education eligibility and the pay-as-you-go structure from Microsoft Learn
- **Medium confidence** - the July 2026 SKU restructure, E7 and Agent 365 pricing, which come from Microsoft licensing news pages and partner analysis
- **Lower confidence** - anything about credit consumption _rates_, which Microsoft does not publish per task. See [[Copilot Cowork licensing and credit costs]] for the estimate bands and their caveats
- **Re-verified 20 August 2026** - the credit rules in Tier 2 and the trap list were checked against Microsoft Learn and corrected. The previous version claimed licensed users were exempt from credits for internal agent use; that is no longer true on the GitHub Copilot harness

## Sources

Microsoft's own:

- [License options for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-licensing) - the authoritative list of SKUs and prerequisites, including education
- [Microsoft 365 Copilot enterprise pricing (UK)](https://www.microsoft.com/en-gb/microsoft-365-copilot/enterprise) - UK list prices
- [Microsoft 365 Copilot business pricing (UK)](https://www.microsoft.com/en-gb/microsoft-365-copilot/business) - SMB SKUs and bundles
- [Copilot in Education](https://www.microsoft.com/en-us/education/products/copilot-in-education) - academic offering
- [Pay-as-you-go service overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/pay-as-you-go/overview) and [meters](https://learn.microsoft.com/en-us/microsoft-365/copilot/pay-as-you-go/meters)
- [Usage-based billing and cost management for Copilot Credits](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits)
- [Copilot Credits licensing guidance](https://www.microsoft.com/licensing/guidance/Copilot-Credits)
- [2026 M365 packaging and pricing updates](https://www.microsoft.com/en-us/licensing/news/2026-m365-packaging-pricing-updates) - the 1 July 2026 changes
- [Work IQ general availability](https://www.microsoft.com/en-us/licensing/news/work-iq-general-availability)
- [Researcher and Analyst general availability](https://www.microsoft.com/en-us/microsoft-365/blog/2025/06/02/researcher-and-analyst-are-now-generally-available-in-microsoft-365-copilot/) - including the 25-query cap

Partner analysis, used only where Microsoft publishes nothing:

- [Orchestry - M365 licensing changes July 2026](https://www.orchestry.com/insight/m365-licensing-changes-july2026) - E7 and Agent 365
- [SAMexpert - Agent 365 licensing](https://samexpert.com/agent-365/)
- [Velosio - Copilot Studio licensing guide 2026](https://www.velosio.com/blog/everything-you-need-to-know-about-microsoft-copilot-studio-licensing/) - credit packs vs pay-as-you-go
