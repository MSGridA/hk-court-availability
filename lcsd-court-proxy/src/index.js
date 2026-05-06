const SOURCES = {
  "tennis": "https://data.smartplay.lcsd.gov.hk/rest/cms/api/v1/publ/contents/open-data/tennis/file",
  "badminton": "https://data.smartplay.lcsd.gov.hk/rest/cms/api/v1/publ/contents/open-data/badminton/file",
  "squash": "https://data.smartplay.lcsd.gov.hk/rest/cms/api/v1/publ/contents/open-data/squash/file",
  "tennis-venues": "https://www.lcsd.gov.hk/datagovhk/facility/facility-tc.json",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, "");

    if (!SOURCES[key]) {
      return jsonResponse(
        {
          error: "Unknown endpoint",
          allowed: Object.keys(SOURCES),
        },
        404
      );
    }

    try {
      const upstreamResponse = await fetch(SOURCES[key], {
        headers: {
          "User-Agent": "HK-Court-Availability-Proxy/1.0",
          "Accept": "application/json,text/plain,*/*",
        },
      });

      const body = await upstreamResponse.text();

      return new Response(body, {
        status: upstreamResponse.status,
        headers: {
          ...corsHeaders,
          "Content-Type":
            upstreamResponse.headers.get("Content-Type") ||
            "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=60",
        },
      });
    } catch (error) {
      return jsonResponse(
        {
          error: "Proxy fetch failed",
          message: error.message,
        },
        502
      );
    }
  },
};
