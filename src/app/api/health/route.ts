import { connection } from "next/server";

// Endpoint de verificación usado por el HEALTHCHECK del Dockerfile.
// connection() evita que la respuesta se genere una sola vez durante el build.
export async function GET() {
  await connection();

  return Response.json({
    status: "ok",
    node: process.version,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
