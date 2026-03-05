// app/api/football/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  if (!endpoint) return Response.json({ error: "endpoint missing" }, { status: 400 });

  const params = new URLSearchParams(searchParams);
  params.delete("endpoint");

  const url = `https://v3.football.api-sports.io/${endpoint}${params.toString() ? "?" + params.toString() : ""}`;
  const apiKey = request.headers.get("x-apisports-key");

  if (!apiKey) return Response.json({ error: "no key" }, { status: 401 });

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
