// The five-level AI Use Hierarchy (Source of Truth, section 2).

export interface HierarchyLevel {
  level: number;
  name: string;
  meaning: string;
  capability: string;
  confidence: string;
  compliance: string;
  /** One real task at this level, shown on the interactive ladder. */
  exampleTask: string;
}

export const HIERARCHY: HierarchyLevel[] = [
  {
    level: 1,
    name: 'Conversational AI',
    meaning: 'Using everyday AI assistants to draft, summarise and question. The starting point for most staff.',
    capability: 'Uses an AI assistant to draft, summarise and question, refining through conversation',
    confidence: 'Willing to try AI on low-risk tasks; knows its limits',
    compliance: 'Follows the AI policy; no sensitive data in unapproved tools; checks outputs',
    exampleTask:
      'Ask an assistant to summarise a 40-page policy into five key points, then check each point against the original.',
  },
  {
    level: 2,
    name: 'Structured Prompting',
    meaning: 'Applying a framework (Role, Context, Task) to get reliable, repeatable outputs.',
    capability: 'Uses the R-C-T framework and reusable prompts for reliable, repeatable results',
    confidence: 'Uses AI routinely without step-by-step help; trusts own judgement on outputs',
    compliance: 'Applies the Green/Amber/Red Decision Matrix to choose suitable tasks',
    exampleTask:
      'Keep a Role, Context, Task prompt that turns each week’s meeting notes into an action list in the same format every time.',
  },
  {
    level: 3,
    name: 'Custom Configuration',
    meaning: 'Building reusable assistants with set instructions, tone and knowledge.',
    capability: 'Builds reusable assistants with set instructions, tone and knowledge',
    confidence: 'Shares tools with colleagues; adapts when tools change',
    compliance: 'Configures with approved data sources, permissions and guardrails',
    exampleTask:
      'Set up a Copilot agent that answers colleagues’ questions from the team handbook, in the team’s tone, and share it with the team.',
  },
  {
    level: 4,
    name: 'Agents and Workflows',
    meaning: 'Designing agents and multi-step workflows with checks and handoffs.',
    capability: 'Designs and runs agents and multi-step workflows with checks and handoffs',
    confidence: 'Hands off multi-step work to AI while staying accountable',
    compliance: 'Builds human checkpoints, data handling and audit trails into workflows',
    exampleTask:
      'Build a workflow that sorts routine enquiries, drafts a reply to each and hands every draft to a named person to check before it goes.',
  },
  {
    level: 5,
    name: 'Integration and Orchestration',
    meaning: 'Connecting AI into team and institutional systems, and coordinating several tools.',
    capability: 'Connects AI into team or institutional systems and coordinates several tools',
    confidence: 'Leads others’ adoption and makes the case for change',
    compliance: 'Owns governance: risk assessment, accountability, monitoring',
    exampleTask:
      'Connect AI to the department’s ticketing and document systems so enquiries are triaged, answered and logged, with an owner and monitoring for each step.',
  },
];
