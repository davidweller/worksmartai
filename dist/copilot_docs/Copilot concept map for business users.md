---
id: 202608191430
tags: []
---

# Copilot concept map for business users

Every term a business user meets in Microsoft Copilot, placed in the layer it belongs to. Built 19 August 2026 to sit behind the two Copilot courses - [[Copilot Chat to 365 Copilot]] and [[Intermediate to Advanced Copilot]] - and [[Build Custom AI Agents]]. The companion handout is [[Copilot glossary for business users]]. Sources for the product facts are in [[Copilot for business users - official Microsoft sources]]. Part of [[_worksmart-ai]].

**Rendered diagram:** https://claude.ai/code/artifact/c3b6c50c-3ed8-4997-9f55-6f542e81a546

**This note is the source; the diagram is the rendering.** Change the note first, then republish.

## The organising idea

Five layers, with governance as the frame around all five rather than a sixth layer - it constrains every other one. Read bottom up: each layer only works if the one beneath it is in place, which is also the order it should be taught in.

## Layer 1 - What you've got

The first question in every training room, and the one nobody in the room can answer.

| Tier                                          | What it adds                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Microsoft Copilot Chat                        | Free with a work sign-in. Web-grounded, protected. Cannot see your files                                                                           |
| Microsoft Copilot (was Microsoft 365 Copilot) | Adds your work data, and Copilot inside Word, Excel, Outlook, Teams. Carries the reasoning agents and agent building                               |
| Copilot Credits                               | Not a tier but a meter. What you spend on Cowork, on agents used by unlicensed people, and on anything built on Copilot Studio's reasoning harness |

There is no product called Copilot Premium. Three things get bought: nothing, a seat, and credits.

Also already switched on: Copilot Academy in Viva Learning, the in-tenant Prompt Gallery, pay-as-you-go metering. And the live question - who has what in _this_ organisation.

## Layer 2 - What it knows: Work IQ

The reason Copilot's answer differs from a public chatbot's. Split the chips into two groups when teaching, because the distinction answers "is it reading my emails?".

- **Your work (your data, not a Microsoft feature):** files, mail, chats and channels, meetings and transcripts, calendar, people and the org graph, SharePoint sites
- **How it reaches them:** Microsoft Graph, Copilot connectors for non-Microsoft systems, the open web, memory and personalisation, knowledge sources scoped per agent

## Layer 3 - Where you meet it

One brain, many doorways. Which doorway you use changes what it can do.

- **Inside the apps:** Word, Excel, PowerPoint, Outlook, Teams, OneNote, Loop, SharePoint, Windows, Edge, mobile
- **As a place you go:** the Microsoft Copilot app at m365.cloud.microsoft, Copilot Chat, Copilot Search, Copilot Pages, Copilot Notebooks, Agent Mode, Copilot Actions, meeting recap

## Layer 4 - How you ask

The transferable skill. Survives every rename Microsoft ships.

- **Prompt anatomy:** goal, context, source, format, tone
- **Working the answer:** iteration and follow-up turns, referencing a file or person or meeting, work / web / both (on screen: the Work IQ button), custom instructions, Prompt Gallery, saved and team prompts
- **What goes wrong:** hallucination and confident wrongness, verification, knowing when not to use it

## Layer 5 - What you build

You stop retyping a prompt and turn it into a thing other people can use.

- **Built by you:** agent, skill, action (on screen: tool), knowledge source, workflow, trigger, human-in-the-loop approval, autonomy, Copilot Studio, harness and credits, SharePoint agent, Agent Store and sharing, testing and iteration, declarative vs custom-engine, connected agents and multi-agent orchestration
- **Shipped for you:** Researcher, Analyst, deep reasoning, meeting facilitator agent, agents from the Store

## The frame - governance and trust

Enterprise data protection and the tenant boundary; permissions inheritance; oversharing; sensitivity labels and DLP; audit trail; agent ownership, review and retirement; consumption and credits; the institution's own AI policy; responsible use and bias; accessibility and inclusion; tacit knowledge.

## The four that get confused

Taught as a glossary, remembered as a blur. They hold as one mechanism: something **triggers** a **workflow**, a step of the workflow **calls** an **agent**, the agent **picks** a **skill**, the skill **uses** an **action**, and the action **touches** a real system.

The mechanism is not a teaching invention - the Copilot Studio build pane lists Model, Skills, Tools, Knowledge and Connected agents down the right-hand side, in that order. Skills are name, description and Markdown instructions; tools are the connections to external systems. Where we say _action_, the screen says _tool_.

| Term     | Discriminator                                                                 |
| -------- | ----------------------------------------------------------------------------- |
| Agent    | **Who** does the work - a named Copilot with a job, rules and fixed sources   |
| Skill    | **What** it can do - one named task, described once and reused                |
| Action   | **What it can reach** - read a library, send a mail, update a list            |
| Workflow | **When and in what order** - steps that fire on a trigger and run without you |

Remove the workflow and you still have an agent you talk to. Remove the agent and the workflow is a plain automation. Remove the actions and the agent can only talk about work, never do it.

## Mapped onto the AI Use Hierarchy

Where each concept is met, against [[AI Use Hierarchy]].

| Level            | Concepts                                                                                                     | Course                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1 Conversational | Copilot Chat, web grounding, prompt basics, verification, hallucination, when not to use it                  | AI Foundations & Responsible Use                       |
| 2 Structured     | Prompt anatomy, iteration, Copilot in the apps, Prompt Gallery, referencing a file, the Work IQ toggle       | AI for Daily Workflows; AI for Summarising & Analysing |
| 3 Configured     | Custom instructions, Notebooks, Pages, SharePoint agent, declarative agents, knowledge sources               | Copilot Chat to 365 Copilot                            |
| 4 Specialist     | Researcher, Analyst, Agent Mode, Copilot Search, deep reasoning, agents from the Store                       | Intermediate to Advanced Copilot                       |
| 5 Agentic        | Copilot Studio, skills, tools and actions, knowledge, triggers, approvals, autonomy, harness and credit cost | Build Custom AI Agents                                 |
| 6 Orchestrated   | Multi-agent, connectors and APIs, custom-engine agents, agent lifecycle, cost management                     | **Not yet covered** - IT and digital leads             |

Level 6 having no course is a real gap, tracked in [[Course Standards Gap List]]. Most staff will work across Levels 1-3 and that is a complete, successful outcome.

## Seven pairs worth a slide of their own

| Pair                              | The difference                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| Copilot Chat vs Microsoft Copilot | Same brain. Only the licensed one can see _your work_                                       |
| Agent vs Skill                    | The agent is _who_. A skill is one thing that _who_ can do                                  |
| Skill vs Workflow                 | A skill sits ready. A workflow is an _order of events_ that fires on its own                |
| Prompt vs instruction             | A prompt is this once. An instruction is _every time_                                       |
| Notebook vs Page vs chat          | Notebook pins the _sources_. Page holds the _output_. Chat is thrown away                   |
| Agent Mode vs an agent            | Agent Mode is Copilot working _harder_ in a document. An agent is a thing you _made_        |
| Copilot Studio vs Power Automate  | Studio builds something that _judges_. Power Automate builds something that _follows rules_ |

## Naming caveat

Microsoft renames tiers and surfaces on roughly a quarterly cycle, and Work IQ is recent enough that its boundaries are still moving. Check every name against Microsoft Learn on the day before anything here reaches a course deck, and stamp the review date on the slide. **Concept structure survives renames; product names do not.**

Corrected on 20 August 2026 against Microsoft Learn: Microsoft 365 Copilot is now Microsoft Copilot; commercial data protection is now enterprise data protection; there is no Copilot Premium tier, only the credit meter; the work/web toggle is labelled Work IQ; and Copilot Studio does have Skills on screen, sitting above Tools. The same pass corrected [[Copilot glossary for business users]] and [[Copilot licensing decoded]].

Last verified against product naming: 20 August 2026.
