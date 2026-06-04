// Lovable AI-powered productivity assistant edge function.
// Handles 5 feature types via structured prompts + streaming chat.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type FeatureType = "email" | "meeting" | "tasks" | "research" | "chat";

const SYSTEM_PROMPTS: Record<FeatureType, string> = {
  email: `You are a professional email writer. Generate clear, well-structured emails based on the user's purpose, target audience, and tone.

OUTPUT FORMAT (strict):
Subject: <a concise, compelling subject line>

<email body in 2-4 short paragraphs>

<professional sign-off>

Rules:
- Match the requested tone exactly (formal, friendly, persuasive, apologetic, etc.).
- Tailor language complexity to the audience.
- Be concise. No filler. No emojis unless the tone is "casual".
- Never include explanations outside the email itself.`,

  meeting: `You are an expert meeting notes summarizer. Convert raw meeting notes/transcripts into a structured executive summary.

OUTPUT FORMAT (strict markdown):
## Summary
<2-3 sentence overview>

## Key Discussion Points
- <bullet>
- <bullet>

## Decisions Made
- <decision>

## Action Items
- **[Owner]** Task — Deadline: <date or "TBD">

## Open Questions
- <question>

Rules:
- Extract owners and deadlines explicitly when present.
- If a section has no content, write "_None identified_".
- Be faithful to the source; do not invent facts.`,

  tasks: `You are an AI task planner. Take a list of tasks/goals from the user and produce a prioritized, scheduled plan.

OUTPUT FORMAT (strict markdown):
## Prioritized Plan

### 🔴 High Priority (Do First)
1. **Task** — Est. time · Suggested slot
   - Why: <one-line rationale>

### 🟡 Medium Priority
1. **Task** — Est. time · Suggested slot

### 🟢 Low Priority / Later
1. **Task** — Est. time

## Suggested Daily Schedule
- **9:00-10:30** — Deep work: <task>
- **10:30-11:00** — <task>
- ...

## Tips
- <1-2 productivity tips relevant to this workload>

Rules:
- Use Eisenhower-style prioritization (urgency + importance).
- Batch similar tasks. Protect a deep-work block.
- Be realistic about time estimates.`,

  research: `You are an AI research assistant. Given a topic or question, produce a structured research brief.

OUTPUT FORMAT (strict markdown):
## Topic
<restated topic>

## Executive Summary
<3-4 sentence overview>

## Key Insights
1. **Insight title** — explanation
2. **Insight title** — explanation
3. **Insight title** — explanation

## Considerations & Trade-offs
- <point>

## Suggested Next Steps
- <actionable step>

## Open Questions for Further Research
- <question>

Rules:
- Be objective. Distinguish established facts from informed opinion.
- Note when information may be outdated or requires verification.
- No fabricated statistics or sources.`,

  chat: `You are a helpful AI workplace productivity assistant. You help professionals with emails, meeting summaries, task planning, research, and general work questions. Be concise, professional, and actionable. Use markdown formatting when it improves clarity. Always remind users to review AI output before sending or acting on it for high-stakes work.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, input, messages } = await req.json();
    const featureType = (type ?? "chat") as FeatureType;
    const systemPrompt = SYSTEM_PROMPTS[featureType] ?? SYSTEM_PROMPTS.chat;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const chatMessages =
      featureType === "chat" && Array.isArray(messages)
        ? [{ role: "system", content: systemPrompt }, ...messages]
        : [
            { role: "system", content: systemPrompt },
            { role: "user", content: String(input ?? "") },
          ];

    const stream = featureType === "chat";

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: chatMessages,
          stream,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
