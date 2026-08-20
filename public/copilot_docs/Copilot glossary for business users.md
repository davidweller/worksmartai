---
id: 202608191445
tags: []
---

# Copilot glossary for business users

54 terms, written for the person using Copilot rather than the person configuring it. Every entry carries the Microsoft page it was checked against on 20 August 2026, or says plainly that no such page exists. Built 19 August 2026 as the learner handout behind [[Copilot concept map for business users]], which places each term in its layer. Revised 20 August 2026. Part of [[_worksmart-ai]].

**Rendered handout:** https://worksmart-ai.co.uk/copilot-glossary/

**This note is the source; the page at `worksmart/src/pages/copilot-glossary.astro` is the rendering.** Change the note first, then the page.

Tags on each entry: _Licences, Your work, Where you use it, Prompts, Agents, Trust, Your organisation_.

## If you only learn four

- **Agent** - _who_ does the work. A named Copilot with a job, rules, and a fixed set of places it may read
- **Skill** - _what_ that agent can do. One named task, described once and reused. On screen Copilot Studio says _tool_ or _topic_
- **Action** - _what it can reach_. The ability to touch a real system: read a library, send a mail, update a list
- **Workflow** - _when, and in what order_. Steps that fire on a trigger and run without you sitting there

## A

**Action** - _Agents_ - An agent's ability to touch a real system rather than just talk about it - read a document library, send an email, add a row to a list, create a task. Without actions, an agent can only produce text. **On screen it says:** tool. The Tools panel in Copilot Studio is worded "connect the agent to external systems and actions" - tool is the container, action is what it does. Separately, Copilot Actions is Microsoft's name for Copilot filling in a form or working through a website on your behalf: a feature, not a building block. [Copilot Studio overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)

**Agent** - _Agents_ - A Copilot you have given a name, a job, a set of rules and a fixed set of sources. Instead of explaining the task every time, you explain it once and then talk to the thing you made. Colleagues can use it too. Most agents wait to be asked; some are given their own account and work on a process without being prompted. **Not the same as:** Agent Mode, which is ordinary Copilot working harder inside one document. An agent you build by describing it is a declarative agent; one a developer writes in code is a custom-engine agent. You will only meet the first kind. [Copilot Studio overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)

**Agent Mode** - _Where you use it_ - Copilot taking on a whole multi-step job inside Word, Excel or PowerPoint - building a document or reworking a spreadsheet across several moves - rather than making one edit and stopping. Generally available in those three apps. [Get started with Agent Mode](https://support.microsoft.com/en-us/topic/get-started-with-agent-mode-in-word-excel-and-powerpoint-4d322d7f-5e89-4f66-9fa4-57d328b156ff)

**Agent Store** - _Agents_ - Where ready-made agents are published - Microsoft's, trusted partners', and your own organisation's - reachable from Teams, Outlook, Word, Excel and PowerPoint. Worth a look before you build anything: somebody has often done it already. Anything your colleagues build has to be approved by an admin before it appears there. [Agent Store](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-agent-store)

**Analyst** - _Agents_ - A specialist agent that works with data. Give it a spreadsheet or a set of figures and it reasons through the analysis, writes and runs the code, and shows you its working. Needs the paid seat, and at launch Microsoft capped it and Researcher at 25 combined runs a month between them. [Researcher and Analyst general availability](https://www.microsoft.com/en-us/microsoft-365/blog/2025/06/02/researcher-and-analyst-are-now-generally-available-in-microsoft-365-copilot/)

**Approval step** - _Agents_ - A point in a workflow where a person has to say yes before anything continues. Also called human in the loop. The safety catch on automation, and usually the difference between a workflow you can defend and one you cannot. [Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview)

**Audit trail** - _Trust_ - The record of what Copilot was asked and what it did, kept in your organisation's compliance tools. It exists, and it matters for FOI, data-protection requests and investigations. [Data protection and auditing](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-architecture-data-protection-auditing)

## C

**Chat history** - _Trust_ - Your past conversations, listed in the chat pane. You can delete a single chat from its More menu, or wipe the lot from My Account under Data and Privacy. Deleting your copy is not the end of it: your organisation can apply a retention policy that keeps prompts and responses for compliance regardless. **Not the same as:** Memory. History is the transcript; memory is what Copilot concluded about how you work. Switch off chat-history personalisation and those conclusions are deleted - switch it back on within 30 days and they return. [How chat history works](https://support.microsoft.com/en-us/microsoft-365-copilot/how-microsoft-365-copilot-chat-history-works)

**Connector** - _Your work_ - A bridge that lets Copilot read a system that is not Microsoft's - a student record system, a CRM, a ticketing tool. Someone in IT sets these up; you only notice that Copilot suddenly knows more. [Copilot connectors](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/)

**Copilot Academy** - _Licences_ - Guided Copilot training already switched on inside Viva Learning for most Microsoft 365 users. Free, already paid for, and usually nobody knows it is there. [Copilot Academy](https://learn.microsoft.com/en-us/viva/learning/academy-copilot)

**Copilot Credits** - _Licences_ - The metered currency for AI that sits outside the seat. Two things consume them. First, people without a paid seat using Copilot Chat, SharePoint agents or the retrieval API on a pay-as-you-go meter. Second, anything built on Copilot Studio's reasoning harness - and there billing starts the moment you start building, not when you publish: creating, previewing, testing and evaluating an agent all consume credits. Agents grounded only in their own instructions and public websites cost nothing. **Replaces:** the phrase "Copilot Premium", which is not a Microsoft product. There are three things to buy: Copilot Chat (free), the Microsoft Copilot seat, and credits. [Usage-based billing for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/billing-credit-overview)

**Copilot Notebooks** - _Where you use it_ - A place to pin the sources for one project - a set of documents, pages and notes - so that every question you ask is answered from those, and only those. The fix for "it keeps dragging in the wrong report". Needs a Copilot or Copilot Chat licence. [Copilot Pages and Notebooks](https://learn.microsoft.com/en-us/microsoft-365/loop/cpcn-requirements)

**Copilot Pages** - _Where you use it_ - Turns an answer in a chat into a document you and colleagues can edit together. Use it the moment an answer is worth keeping; chat threads are disposable, pages are not. Available on the free tier too - it needs a OneDrive licence rather than a Copilot one. [Copilot Pages and Notebooks](https://learn.microsoft.com/en-us/microsoft-365/loop/cpcn-requirements)

**Copilot Search** - _Where you use it_ - Search across your organisation's content and connected third-party systems that answers the question rather than handing you twenty links to open. It comes with the paid seat at no extra cost, appears as a tab in the Copilot app, and needs no setting up. [Copilot Search](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-search)

**Copilot Studio** - _Agents_ - The place where agents, workflows and agent flows are built, tested and published - without writing code. This is where a repeated prompt becomes something your team can use. **Not the same as:** Power Automate, which follows fixed rules. An agent built in Studio exercises judgement about what to do next. [Copilot Studio overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)

**Cowork** - _Licences_ - Long-running, delegated multi-step work: you give Copilot a task and walk away. The paid seat is a prerequisite, not an entitlement - holding Microsoft Copilot licences does not cover Cowork. Tasks are metered in Copilot Credits on top of the seat. **Not the same as:** Agent Mode, which works inside one document while you watch. Cowork is billed separately; the seat does not pay for it. [Usage-based billing and cost management for Copilot Credits](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits)

**Custom instructions** - _Prompts_ - Standing context you set once - your role, your department, how you like things written - so you stop retyping it in every prompt. **Not the same as:** the Instructions you write when building an agent. Custom instructions shape your own Copilot; an agent's instructions shape everybody's. [Personalise what Copilot remembers](https://support.microsoft.com/en-us/Microsoft-365-Copilot/personalize-what-microsoft-365-copilot-remembers)

## D

**Deep reasoning** - _Agents_ - Copilot taking longer to think before it answers. Slower and more expensive, and worth it for genuine analysis rather than for drafting an email. [Researcher and Analyst](https://learn.microsoft.com/en-us/microsoft-365/copilot/researcher-agent)

**Disclosure** - _Your organisation_ - Saying that you used AI, and how. Your institution decides when this is required - marking, admissions, research outputs, student-facing writing - and the rule is usually about the decision, not the draft. Nobody declares spellcheck; people do declare a marking rubric applied by a machine. Find your own policy before you need it. **Our term:** not Microsoft's. Microsoft governs what the tool may do; your institution governs what you must say about it. _No Microsoft page defines this; it is a WorkSmart-AI teaching term._

**DLP** - _Trust_ - Data loss prevention - the rules your organisation sets about what can leave, and where. Copilot obeys them, which is occasionally why an answer stops short. [Purview data loss prevention](https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp)

## E

**Education licences** - _Licences_ - The academic versions: Microsoft 365 A1, A3 and A5, and their Office 365 equivalents. Copilot Chat comes with them at no extra cost, though admins have to take extra steps before students aged 13 and over can use it. The paid Microsoft Copilot seat is a separate academic add-on, bought through EES or a reseller. "We have A5" therefore does not mean "we have Copilot". [Licence options for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-licensing)

**Enterprise data protection** - _Trust_ - The contractual promise covering what you type into Copilot: prompts and responses carry the same terms as your mail in Exchange and your files in SharePoint, and are not used to train the foundation models. It applies to anyone signed in with a work account, with no admin action required, and it brings your sensitivity labels, retention policies and audit with it. **Older material calls this:** commercial data protection. For Copilot and Copilot Chat on a work account, the current term is enterprise data protection, or EDP. [Enterprise data protection](https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection)

## G

**Grounding** - _Your work_ - Answering from real sources rather than from memory. A grounded answer carries numbered references you can click; an ungrounded one is the model's best guess. Look for the references before you trust the paragraph. [Semantic index for Copilot](https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot)

## H

**Hallucination** - _Prompts_ - A confident, fluent, wrong answer. It is not a bug being fixed next release - it is how these tools work, and it is why verification is your job rather than Microsoft's. _No Microsoft page defines this; it is a WorkSmart-AI teaching term._

**Harness** - _Agents_ - Which engine an agent runs on. Copilot Studio offers the GitHub Copilot harness for reasoning-heavy, multi-step work, the standard harness for rule-based conversations, and the Copilot chat harness for adding your knowledge to Copilot Chat. The choice decides how capable the agent is and how it is billed, so it is a budget decision as much as a technical one. [Agent harnesses overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview)

## I

**Instructions** - _Agents_ - What you write when you build an agent: its job, its rules, its tone, what it must never do. The single biggest lever on whether the agent is any good. [Copilot Studio overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)

**Iteration** - _Prompts_ - Steering the answer with follow-up turns instead of retyping the prompt from scratch. "Shorter." "More formal." "Now for the student audience." The cheapest skill on this list and the most under-used. _No Microsoft page defines this; it is a WorkSmart-AI teaching term._

## K

**Knowledge source** - _Your work_ - The specific places an agent is allowed to read - a SharePoint site, a set of documents, a connector. Narrowing these is what turns a vague agent into a reliable one. [Knowledge in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)

## M

**Meeting recap** - _Where you use it_ - The summary, action points and "what did I miss" answers after a Teams meeting. The catch nobody mentions is the transcript. The organiser's meeting options decide it: set to only during the meeting, Copilot works live on temporary speech-to-text and leaves nothing behind; set to during and after, somebody has to actually start transcription. No transcript, no recap - and no asking about it tomorrow. **Also:** Copilot in meetings needs a paid seat, and does not work at all in end-to-end encrypted meetings. [Copilot in Teams meetings and transcription](https://learn.microsoft.com/en-us/microsoftteams/copilot-teams-transcription)

**Memory** - _Your work_ - Copilot holding on to preferences and context across sessions - how you like things written, what you work on, the tasks that recur - so it does not start from nothing each morning. You can read what it has saved in Chat settings, delete any of it, or turn the whole thing off. Turning it back on within 30 days restores what was deleted. [Personalise what Copilot remembers](https://support.microsoft.com/en-us/Microsoft-365-Copilot/personalize-what-microsoft-365-copilot-remembers)

**Microsoft Copilot** - _Licences_ - The paid seat. This is the one that can see your work - files, mail, chats, meetings - and that appears inside Word, Excel, Outlook and Teams. Microsoft Copilot Business is the same idea sold against the Microsoft 365 Business plans. **Was called:** Microsoft 365 Copilot. Microsoft renamed it, and its own documentation says some experiences and licences will keep the old name during the transition. [Licence options for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-licensing)

**Microsoft Copilot Chat** - _Licences_ - The free tier, included with any eligible Microsoft 365 subscription and reached at m365copilot.com. It has two halves: web-based chat, grounded in the internet and available to everyone, and work-based chat, which reads your organisation's content and needs the paid seat. Both carry enterprise data protection. File upload, image generation and Copilot Pages are included. **Why it matters:** the free and paid versions look almost identical on screen. Most "Copilot is useless" verdicts are somebody using the free one and expecting the demo. [Copilot Chat overview](https://learn.microsoft.com/en-us/copilot/overview)

**Model** - _Prompts_ - The engine underneath. Copilot is not one fixed thing: it runs on frontier models from OpenAI and Anthropic, Microsoft swaps the default without telling you, and in some apps you can pick. An agent you build in Copilot Studio has its own model box at the top of the Build pane. The practical consequence is that the same prompt can behave differently this month than last, which is a reason to check output rather than to memorise tricks. **Not the same as:** the app. Copilot is Microsoft's wrapper - the licence, the permissions, the grounding - around somebody else's model. [Copilot with Anthropic models](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-anthropic-apps)

**Multi-agent orchestration** - _Agents_ - Agents handing work to other agents. On screen it is the Connected agents box in the Build pane. Real, occasionally useful, and firmly a job for whoever owns the platform rather than for you on a Tuesday afternoon. [Build an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview)

## O

**Oversharing** - _Trust_ - Copilot surfacing something that was always technically visible to you but practically buried - an old pay file in a site nobody tidied. Copilot did not break a permission. It found one that was already wrong. IT can hide a site from Copilot and organisation-wide search without changing who may open it, using restricted content discovery, which also strips the Copilot buttons from that site. [Restricted content discovery](https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery)

## P

**Permissions inheritance** - _Trust_ - Copilot can only see what your account can already see - no more, and no less. The answer to "can it read my colleague's mail?" is no, unless you already could. [Data protection and auditing](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-architecture-data-protection-auditing)

**Prompt** - _Prompts_ - What you ask for. A good one carries five things: the goal, the context, the source to use, the format you want back, and the tone. Most disappointing answers are missing three of those. [Learn about Copilot prompts](https://support.microsoft.com/en-us/topic/learn-about-copilot-prompts-f6c3b467-f07c-4db1-ae54-ffac96184dd5)

**Prompt Gallery** - _Prompts_ - A library of prompts inside Copilot - Microsoft's, your organisation's, and ones you save yourself. Start here rather than from a blank box. [Copilot Prompt Gallery](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-prompt-gallery)

## R

**Referencing** - _Prompts_ - Pointing Copilot at a specific file, person or meeting inside your prompt, usually by typing a slash or an oblique. Turns "summarise our policy" into a question it can actually answer. [Learn about Copilot prompts](https://support.microsoft.com/en-us/topic/learn-about-copilot-prompts-f6c3b467-f07c-4db1-ae54-ffac96184dd5)

**Researcher** - _Agents_ - A specialist agent that works through a question over several steps, across your work data and the web, and comes back with a sourced report rather than a paragraph. It deliberately takes longer, and it will ask you clarifying questions on the way. Needs the paid seat, and shares a monthly allowance of 25 runs with Analyst. [Researcher and Analyst general availability](https://www.microsoft.com/en-us/microsoft-365/blog/2025/06/02/researcher-and-analyst-are-now-generally-available-in-microsoft-365-copilot/)

**Responsible use** - _Trust_ - Your institution's own rules about what AI may be used for - marking, admissions, personal data, student-facing decisions. These sit above anything Microsoft permits, and they are the ones you will be held to. _No Microsoft page defines this; it is a WorkSmart-AI teaching term._

## S

**Saved and team prompts** - _Prompts_ - A prompt you keep, and one your team shares. The step between "I worked out a good prompt" and "the department has a good prompt". [Copilot Prompt Gallery](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-prompt-gallery)

**Sensitivity label** - _Trust_ - The classification stuck to a document - public, internal, confidential. Copilot and agents recognise it. Where an answer draws on several documents, you see the most restrictive label of the sources, and where a label encrypts the file, Copilot returns its content only if you personally have the right to copy from it. [Sensitivity labels](https://learn.microsoft.com/en-us/purview/sensitivity-labels)

**SharePoint agent** - _Agents_ - An agent created straight from a site or document library, so it answers only from what is in there, and only what each person is already allowed to see. The easiest first agent anyone builds, and often the only one a team needs. You need a paid seat to create one; colleagues without a seat can use it only if your organisation has switched on pay-as-you-go billing. [Agents in SharePoint](https://learn.microsoft.com/en-us/sharepoint/get-started-sharepoint-agents)

**Skill** - _Agents_ - One named thing an agent can do, written out once: "triage an enquiry", "draft a reply in our house style", "flag anything about fees". In Copilot Studio a skill is three fields - a name, a description of when it applies, and the instructions to follow - and the agent picks the one whose description matches what it has been asked. An agent with three clear skills beats an agent with one vague instruction. **Not the same as:** a tool. In the Build pane, Skills sits directly above Tools: a skill is behaviour, how to do the job; a tool is reach, the system it touches. Skills are plain Markdown, so a good one can be handed to another agent. [Skills overview for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-overview)

## T

**Tacit knowledge** - _Your organisation_ - What your team knows but has never written down - so Copilot cannot read it. The most common reason a technically correct answer is still the wrong answer for your institution. _No Microsoft page defines this; it is a WorkSmart-AI teaching term._

**Tenant** - _Trust_ - Your organisation's own walled section of Microsoft's cloud. "Inside the tenant" means inside the boundary your data protection promise covers. [Enterprise data protection](https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection)

**Trigger** - _Agents_ - What starts a workflow without you: a time of day, an email arriving, a file being added, a form being submitted. Choosing the trigger is most of designing the workflow. [Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview)

## V

**Verification** - _Prompts_ - Checking the output before you use it. This does not transfer to the tool, the vendor or your IT department. If it goes out under your name, it is yours. _No Microsoft page defines this; it is a WorkSmart-AI teaching term._

## W

**What Copilot cannot see** - _Your work_ - The honest limits of the organisation-wide index. It covers Word, PowerPoint, PDF, OneNote and SharePoint pages, plus your own mailbox. It does not cover shared or delegated mailboxes, archived content, or anything in a site an admin has set not to appear in search. Files over 512 MB are skipped, and images and video are ignored beyond their file names. Spreadsheets are not in the indexed list, which is why "find the report" works better than "find the spreadsheet". **Also:** a new document on a SharePoint site is indexed daily rather than instantly, so a file added this morning may genuinely not be findable this afternoon. [Semantic indexing for Copilot](https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot)

**Where Copilot lives** - _Where you use it_ - One product, several doors: the Microsoft Copilot app at m365.cloud.microsoft, the side pane inside Word, Excel, Outlook and Teams, the Copilot button on a SharePoint library, and Edge. What you can do changes with the room you are standing in - the app is for asking across everything, the side pane is for working on the thing in front of you. **Note:** the free Copilot Chat lives at m365copilot.com and redirects into the same app. The consumer Copilot at copilot.microsoft.com is a different product on a personal account. [Decide which Copilot is right for you](https://learn.microsoft.com/en-us/microsoft-365/copilot/which-copilot-for-your-organization)

**Work IQ** - _Your work_ - Microsoft's name for the layer that gives Copilot an understanding of your organisation - your documents, mail, meetings, and how people and projects connect, built on the plumbing IT calls the Microsoft Graph. It is the reason Copilot's answer is different from a public chatbot's, and the reason it can be wrong in specific, local ways. **What it is not:** a person reading your email. It is a permissions-bound index your account already had access to. [Work IQ overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/work-iq/)

**Work, web, or both** - _Prompts_ - The toggle that decides whether Copilot answers from your organisation's content, from the open internet, or from both. It changes the answer completely, and people forget it is there. **On screen it says:** Work IQ. Turning that button on grounds the answer in what your account can reach; turning it off sends you back to the web. [Decide which Copilot is right for you](https://learn.microsoft.com/en-us/microsoft-365/copilot/which-copilot-for-your-organization)

**Workflow** - _Agents_ - An ordered set of steps that runs on a trigger, usually without you watching. A step can call an agent, wait for a person to approve, and then carry on. Copilot Studio also keeps the older, more literal version under the name agent flows. **Not the same as:** an agent. The agent is the worker; the workflow is the rota. [Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview)
