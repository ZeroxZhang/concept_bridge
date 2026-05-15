import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

export async function POST(req: Request) {
  try {
    const { concept } = await req.json();

    if (!concept) {
      return NextResponse.json({ error: "Concept is required." }, { status: 400 });
    }

    const systemPrompt = `你是一个语义网络分析专家。
请给出概念 "${concept}" 的 3 个核心子概念或具体分支领域。
这些子概念必须是 "${concept}" 的组成部分、下级分类或具体体现，而不是平级的随机相关概念。

请以纯 JSON 格式输出，不要有任何 Markdown 标记（例如不要包裹 \`\`\`json \`\`\`），确保可以直接被 JSON.parse 解析。
JSON 结构必须严格如下：
{
  "nodes": [
    { "id": "新概念词1", "type": "branch", "description": "15字以内的简短解释" },
    { "id": "新概念词2", "type": "branch", "description": "15字以内的简短解释" },
    { "id": "新概念词3", "type": "branch", "description": "15字以内的简短解释" }
  ],
  "links": [
    { "source": "${concept}", "target": "新概念词1", "relation": "关系描述" },
    { "source": "${concept}", "target": "新概念词2", "relation": "关系描述" },
    { "source": "${concept}", "target": "新概念词3", "relation": "关系描述" }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error("No response from LLM");
    }

    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText.trim().replace(/^```json/m, '').replace(/```$/m, ''));
    } catch (parseError) {
      console.error("JSON parse error:", responseText);
      throw new Error("Failed to parse LLM response as JSON");
    }

    return NextResponse.json(jsonResult);
  } catch (error: any) {
    console.error("Expand API error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
