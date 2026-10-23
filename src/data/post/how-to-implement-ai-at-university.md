---
publishDate: 2026-04-14T09:00:00.000Z
author: 'David Weller'
title: 'How to implement AI at your university: a staged guide'
image: '~/assets/images/how-to-implement-ai-at-university.png'
excerpt: 'A practical guide to implementing AI at a UK university: strategy, governance, policy, tools, staff training, students, and how to measure impact.'
metadata:
  title: 'How to Implement AI at Your University: A Staged Guide'
  description: 'A practical guide to implementing AI at a UK university: strategy, governance, policy, tools, staff training, students, and how to measure impact.'
---

Most universities have already started using AI, whether or not they planned to. Students use it: the HEPI and Kortext 2026 survey found that 94% of UK undergraduates use generative AI to help with assessed work[^1]. Staff use it too, often in tools the university never approved. What's usually missing is a plan. If you're working out how to implement AI at university level, this guide sets out the stages in a practical order: strategy and governance, policy, tools and licensing, staff training, students, and measuring impact.

It's written for the people who have to make it happen: PVCs, directors of digital and education, and L&D and HR leads. Each stage links to a deeper article if you want the detail.

## Why AI implementation in higher education stalls

AI is now near the top of the agenda for university leaders. Jisc's 2025 leadership survey found it was the second biggest challenge for HE leaders, named by 51%, behind only financial sustainability[^2]. Pressure to act is high, and the cost of a wrong move is visible.

Most stalled programmes follow a familiar pattern. A pilot with twenty enthusiastic volunteers goes well. The board approves a wider rollout. Six months later, usage has settled at roughly the people who would have used it anyway, and licence spend carries on at the same rate.

The tools rarely cause this. Three things decide whether AI pays off: data AI can reach and trust, processes written down clearly enough for something other than a colleague to follow, and staff who know how to use the tools well. We set out that argument in the three foundations of AI adoption. The short version is that you build them in reverse. Train staff first, because using AI on real tasks is what surfaces the processes and the data that matter. Waiting for a central data or process-mapping project to finish before staff can start means waiting longer than the tools stay still.

That shapes everything below. Each stage aims to get staff using AI well, safely, and soon, while the institutional work catches up underneath.

## Stage 1: Find out where your staff are now

Before you write a strategy, find out what's happening. In most universities the spread is wide. One colleague has never opened Copilot. Another has built their own assistant for a weekly report. A third is pasting student data into a free chatbot on their phone.

You need a shared way to describe that spread. We use the [AI Use Hierarchy](/ai-use-hierarchy/), a five-level framework that runs from everyday conversational use (Level 1) through structured prompting, custom assistants, and agents and workflows, to AI integrated into institutional systems (Level 5). It describes how people work with AI, not how much they know about it, and it holds whichever tools you've approved.

A quick baseline should answer four questions:

1. Which AI tools are staff using now, approved or not?
2. Where do most teams sit on the hierarchy?
3. Which roles have the most repetitive, time-consuming tasks?
4. Do staff know what the current AI policy allows?

A short survey, a few team conversations, and your Microsoft 365 usage reports will answer most of this. The point isn't precision. It's to stop planning for an imagined workforce.

## Stage 2: Set your university AI strategy and governance

A university AI strategy doesn't need to be long. It needs to answer who owns AI adoption, what you're trying to achieve in the next twelve months, and how decisions get made.

### Give it one owner

AI sits across education, research, professional services, IT, and HR, so it tends to belong to everyone and therefore no one. Name one senior owner. A PVC Education, a Chief Digital Officer, or a Chief Operating Officer can all work. What matters is that one person can make a decision and be held to it.

### Keep the steering group small

A working group of five to eight people is enough: the owner, someone from digital or IT, someone from education, someone from research, an HR or L&D lead, and a student representative. Add legal, data protection, and academic integrity expertise as advisers rather than permanent members. A group of twenty meets monthly and decides nothing.

### Set goals you can measure

"Become an AI-enabled university" can't be measured. These can:

- Raise the share of staff using approved AI tools at least weekly
- Train every member of staff in AI foundations and responsible use within a set period
- Cut the use of unapproved tools for work tasks
- Give every student clear guidance on what's allowed in each module

### Plan for promotion, not just permission

Ground-up adoption has a known failure mode: forty people build forty slightly different assistants, nobody maintains them, and the good one leaves when its builder does. Governance should give staff somewhere to share what they build, and give someone the job of noticing when the same thing has been built three times. That's how a local fix becomes an institutional standard.

If your senior team wants to work through this together, a facilitated leadership workshop can shorten the process. We run two: The AI Leadership Briefing and The AI Strategic Roadmap.

## Stage 3: Write an AI policy staff can follow

Most UK universities now have some form of AI guidance, and many have adapted the Russell Group's five principles on generative AI in education, which cover AI literacy, staff support, adapting teaching and assessment, academic integrity, and sharing practice[^3]. Principles are a good start. Staff also need something they can apply on a Tuesday afternoon.

A usable policy answers three practical questions:

- **Which tools can I use?** Name the approved tools and the account to use them in. A protected institutional account and a personal free one look almost identical and handle data very differently.
- **What must I never put into AI?** Be specific: personal data, student records, unpublished research, and anything confidential, with examples from real roles.
- **Which tasks are suitable?** A simple Green/Amber/Red Decision Matrix helps here. Green tasks are low risk and fine to try. Amber tasks need a human check before anything goes out. Red tasks stay off AI entirely.

Keep it short, put it where staff look, and review it at least once a year, because the tools change faster than the committee cycle. For the full process, see our guide to [writing a university AI policy](/university-ai-policy/). For the wider picture, including ethics, data protection, and accessibility, read [responsible AI in higher education](/responsible-ai-higher-education/).

## Stage 4: Choose tools and licences you'll use

Most UK universities already have Microsoft 365, so the first AI tool is often already in the tenancy. The question is less "which tool?" and more "which version, for whom?"

### Start with what you already pay for

Microsoft offers Copilot Chat, a secure chat assistant available to many Microsoft 365 users, and Microsoft 365 Copilot, a paid add-on that works inside Word, Outlook, Teams, and your organisation's files. They look similar and do quite different jobs. Our comparison of [Copilot Chat vs Microsoft 365 Copilot](/copilot-chat-vs-microsoft-365-copilot/) explains the difference, and [Microsoft 365 Copilot licensing for universities](/copilot-licensing-universities/) covers the options and costs.

### Don't buy premium licences for everyone at once

Paid licences deliver most value for staff who already use AI well and whose work runs through Microsoft 365 files and meetings. Start with the roles where the time saving is clearest, measure use, then expand. A licence nobody opens is the most expensive kind.

### Close the gap that drives shadow AI

Microsoft's UK research with Censuswide in October 2025 found that 71% of UK employees had used unapproved consumer AI tools at work, and 28% said their employer didn't provide an approved option[^4]. Banning tools rarely works. Providing a good approved option, and showing staff how to use it, does more.

### Plan for agents later, not first

Agents and automated workflows come further up the hierarchy. When teams are ready, Copilot Studio is where they're usually built, and the choice between [agent flows and workflows in Copilot Studio](/copilot-studio-agent-flows-vs-workflows/) matters for cost and control. Don't start there. An agent is only as good as the instructions behind it.

## Stage 5: AI upskilling for university staff

Training is the stage that pays back fastest, and it's where most universities underinvest. Microsoft's 2024 Work Trend Index found that only 39% of AI users had received any training from their employer[^5]. The rest are teaching themselves, with no reference to your policy or your tools.

### Train everyone in the foundations

Every member of staff needs four things: a working idea of how AI produces an answer (it predicts plausible text rather than looking facts up, which is why it can be confidently wrong), a habit of checking outputs, a clear sense of what the policy allows, and a reliable way to prompt. Our article on [AI literacy training for staff](/ai-literacy-training-staff/) covers what a good foundation programme includes.

### Make it task-based

Staff don't need a tour of features. They need to leave with something that saves them time next week. The best sessions open with a real task from the person's own role inside the first ten minutes, and end with them applying it to their own work.

### Then train by role

Once the foundations are in place, training works best when it's specific to the job:

- **Academic staff** need help with content creation, teaching, and assessment design. See [AI for academic assessment](/ai-for-academic-assessment/).
- **Researchers** need guidance on literature tools, data, and research integrity. See [AI tools for researchers](/ai-tools-for-researchers/).
- **Professional services staff** get most from process improvement and communications.
- **Digital and AI leads** need the skills to design agents and govern them.

### Don't skip levels

The commonest mistake is starting too high. Staff who haven't built reliable prompting habits can't write good instructions for an agent, so agents built too early produce inconsistent results and staff lose trust. Start every all-staff programme at Level 1 of the [AI Use Hierarchy](/ai-use-hierarchy/), and move teams up once they have something real to build on.

### Keep it going

Capability decays. Features ship monthly and staff turn over, so a cohort trained eighteen months ago is working from an out-of-date picture. Build in refreshers, drop-in sessions, and a place to share what works.

If you also work with partner schools, colleges, or a trust, the same principles apply with different risks. Our guide to [AI training for schools and trusts](/ai-training-schools-trusts/) covers them.

## Stage 6: Support students to use AI well

Students are already using AI, so the question is whether they're using it well. The same HEPI survey found that students overwhelmingly see AI skills as essential for their futures, but fewer than half feel supported by their teaching staff to develop them[^1].

Three things help:

1. **Clear module-level guidance.** Students need to know what's allowed in each assessment, not just in a university-wide statement. A simple scale, from "no AI" to "AI encouraged with acknowledgement", set for each assessment, removes most of the guesswork.
2. **A foundation course for every student.** A short, self-paced course on how AI works, how to check it, and how to use it honestly gives every student the same baseline, whatever their subject.
3. **Assessment that holds up.** Detection tools aren't reliable enough to base misconduct cases on. Redesigning assessment so it tests what AI can't do for the student is more durable. [AI for academic assessment](/ai-for-academic-assessment/) covers the options.

Staff training and student guidance should match. If staff and students hear different rules, students will follow whichever is more convenient.

## Stage 7: Measure impact

Leaders who fund AI programmes will ask what they got for the money. Decide how you'll answer before you start, not after. We measure three things, at every level of the hierarchy:

| What to measure | How to measure it                                                                                                      | What it tells you                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Capability      | Assessments mapped to published learning outcomes, plus real work at higher levels: a prompt, an assistant, a workflow | Whether staff can do the tasks      |
| Confidence      | Can-do statements staff rate from 1 to 5 before and after training                                                     | Whether they'll use AI without help |
| Compliance      | Scenario questions, such as classifying tasks as green, amber, or red                                                  | Whether they'll use it safely       |

Add two institutional measures on top:

- **Usage of approved tools.** Microsoft 365 admin reports show how many licensed staff use Copilot and how often. Rising regular use is the clearest sign that training has stuck.
- **Time saved.** Ask staff at the end of each course how much time AI saves them per week. It's self-reported, so treat it as an estimate, but it's the figure finance will ask for. Our [AI Savings Calculator](/roi-calculator/) gives you a starting estimate before you begin.

Report progress every term to the steering group, and every year to the board.

## What a first year can look like

Every university is different, but a realistic first year often follows this shape:

| When           | Focus                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Months 1 to 2  | Baseline staff use, name an owner, form the steering group, agree goals                        |
| Months 2 to 3  | Update the AI policy and Green/Amber/Red guidance; confirm approved tools                      |
| Months 3 to 6  | Foundation training for all staff; student foundation course; module-level assessment guidance |
| Months 6 to 9  | Role-based training; targeted premium licences; a shared space for what staff build            |
| Months 9 to 12 | First custom assistants and agents in teams that are ready; measure and report; plan year two  |

The order matters more than the dates. Training starts early because it surfaces everything else.

## Common mistakes to avoid

- **Waiting until everything is ready.** Your data will never be perfect. Staff can get value at Levels 1 and 2 long before it is.
- **Buying licences before building skills.** Licence spend without training produces a spike in use for a fortnight and a slow decline after.
- **Writing a policy nobody reads.** If staff can't apply it to a real task, it won't change behaviour.
- **One-off training.** A single session doesn't build a habit. A path does.
- **Attaching "efficiency" to the programme.** If staff think writing down their work is writing their own redundancy note, you'll get careful, incomplete descriptions. Frame it as giving people time back.

## Start with a clear picture of your staff

The quickest way to start is our free AI Capability Check. It's a 30-minute call over Teams or Zoom, with no obligation. We'll place your staff on the AI Use Hierarchy, give you two or three prioritised next steps, and send you a written report to keep.

**[Book your free AI Capability Check](/health-check/)**

If you'd rather start with numbers, try the [AI Savings Calculator](/roi-calculator/) to estimate where AI could save your staff time, or [explore the courses](/services/staff-training/) mapped to each level of the hierarchy.

## Frequently asked questions

**How do universities implement AI?**
Most successful programmes follow the same stages: find out how staff use AI now, name one owner and a small steering group, write a practical policy, confirm approved tools, train staff and students, and measure capability, confidence, compliance, and usage. Training early matters most, because it shows you which processes and data need attention.

**What should a university AI strategy include?**
A named senior owner, a small steering group, three to five measurable goals for the next twelve months, an approved-tools list, a usable AI policy, a staff and student training plan, and a way to measure and report progress.

**How long does it take to implement AI at a university?**
A first year can cover a baseline, an updated policy, foundation training for all staff and students, and the first role-based training. Building custom assistants and agents in teams that are ready usually follows in the second half of the year and beyond.

**Do all staff need Microsoft 365 Copilot licences?**
No. Many staff get real value from Copilot Chat, which comes at no extra cost with many Microsoft 365 plans. Paid licences make most sense for roles whose work runs through Microsoft 365 files and meetings, once staff can use AI well. See [Copilot Chat vs Microsoft 365 Copilot](/copilot-chat-vs-microsoft-365-copilot/).

**Where should a university start with AI?**
Start by finding out where your staff are. A free [AI Capability Check](/health-check/) places your team on the AI Use Hierarchy and gives you prioritised next steps.

[^1]: HEPI and Kortext, _Student Generative Artificial Intelligence Survey 2026_ (HEPI Report 199, March 2026; 1,054 full-time undergraduates, fieldwork by Savanta). https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/

[^2]: Jisc National Centre for AI, _AI and Jisc's leadership survey 2025_ (May 2025). https://nationalcentreforai.jiscinvolve.org/wp/2025/05/01/ai-and-jiscs-leadership-survey-2025/

[^3]: Russell Group, _Principles on the use of generative AI tools in education_ (July 2023). https://russellgroup.ac.uk/policy/policy-briefings/principles-use-generative-ai-tools-education

[^4]: Microsoft UK, _Rise in shadow AI tools raising security concerns for UK organisations_ (research by Censuswide with 2,003 UK employees, October 2025). https://ukstories.microsoft.com/features/rise-in-shadow-ai-tools-raising-security-concerns-for-uk

[^5]: Microsoft and LinkedIn, _2024 Work Trend Index Annual Report: AI at work is here. Now comes the hard part_ (May 2024). https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part
