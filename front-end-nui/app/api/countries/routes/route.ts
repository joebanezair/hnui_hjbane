// app/api/countries/route.ts
import { NextResponse } from "next/server";

type ApiCountry = {
  iso2?: string;
  name?: string;
  // ... other fields may exist, we only use these two
};

type ApiResponse = {
  data?: ApiCountry[];
};

export async function GET() {
  try {
    const res = await fetch("https://www.apicountries.com/countries", {
      // Avoid caching transient failures
      cache: "no-store",
      // Optional: increase timeout behavior via AbortController if needed
    });

        
    if (!res.ok) {
      return NextResponse.json(
        { message: `Upstream error: ${res.status}` },
        { status: 502 }
      );
    }

    const json = (await res.json()) as ApiResponse;

    // Defensive guards
    const list = Array.isArray(json?.data) ? json.data : [];

    // Map and filter only valid entries
    const countries = list
      .map((c) => ({
        iso2: (c.iso2 || "").trim(),
        name: (c.name || "").trim(),
      }))
      .filter((c) => c.iso2 && c.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ countries }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch countries", error: String(err) },
      { status: 500 }
    );
  }
}
