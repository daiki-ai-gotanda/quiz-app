export async function POST(req: Request) {
  const { content } = await req.json();

export async function POST(req: Request) {
  console.log("AI要約APIが呼ばれました"); // ← これが出ればPOSTが通ってる

  const { content } = await req.json();
  ...
}

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "あなたはニュース記事をクイズ化するアシスタントです。"
        },
        {
          role: "user",
          content: `次のニュース本文から「質問」「選択肢4つ」「正解」を以下のJSON形式で生成してください。\n{
  "question": "...",
  "choices": ["...", "...", "...", "..."],
  "answer": "..."
}\n本文: ${content}`
        }
      ]
    })
  });

  const data = await response.json();
  const raw = data.choices[0].message.content;

  // ✅ ここでログ出力
  console.log("AIの返答:", raw);

  try {
    const quiz = JSON.parse(raw);
    return NextResponse.json(quiz);
  } catch (err) {
    console.error("AIの返答がJSON形式ではありません:", raw);
    return NextResponse.json({ error: "AIの返答が不正です", raw });
  }
}

export async function POST(req: Request) {
  console.log("AI要約APIが呼ばれました"); // ← PowerShellに出るはず

  const { content } = await req.json();
  ...
}
