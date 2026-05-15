import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

export async function POST(req: Request) {
  try {
    const { source, target } = await req.json();

    if (!source || !target) {
      return NextResponse.json({ error: "Source and target concepts are required." }, { status: 400 });
    }

    const systemPrompt = `你是一个语义网络分析专家。
请找到从概念 "${source}" 到概念 "${target}" 的逻辑推演路径。
你必须找到中间经过的 3-4 个重要且独立的关键概念，将它们连接起来形成一条路径。

请以纯 JSON 格式输出，不要有任何 Markdown 标记（例如不要包裹 \`\`\`json \`\`\`），确保可以直接被 JSON.parse 解析。
JSON 结构必须严格如下：
{
  "nodes": [
    { "id": "概念词1", "type": "main" | "intermediate", "description": "15字以内的简短解释" },
    ...
  ],
  "links": [
    { "source": "概念词1", "target": "概念词2", "relation": "关系描述" },
    ...
  ]
}

- "${source}" 和 "${target}" 必须包含在 nodes 中，其 type 为 "main"。
- 中间节点 type 为 "intermediate"。
- links 必须依次连接这条路径：source -> 中间节点1 -> 中间节点2 -> ... -> target。
`;

    const completion = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.7,
      response_format: { type: "json_object" } // DeepSeek supports json_object if specified in prompt
    });

    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error("No response from LLM");
    }

    // Attempt to parse JSON (handling cases where LLM might still wrap it in markdown)
    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText.trim().replace(/^```json/m, '').replace(/```$/m, ''));
    } catch (parseError) {
      console.error("JSON parse error:", responseText);
      throw new Error("Failed to parse LLM response as JSON");
    }

    return NextResponse.json(jsonResult);
  } catch (error: any) {
    console.error("Bridge API error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
