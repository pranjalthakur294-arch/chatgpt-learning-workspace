export async function sendToAI(
  prompt: string
) {
  const response = await fetch(
    "http://localhost:5000/chat",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    }
  );

  const data =
    await response.json();

  return data.reply;
}