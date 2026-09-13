
export async function generateTitle(
  question: string
) {
  const response = await fetch(
    "http://localhost:5000/generate-title",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  const data =
    await response.json();

  return data.title;
}