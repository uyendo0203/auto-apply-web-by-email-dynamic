import { handlers, auth } from "@/lib/auth";

console.log("🚀 Auth route initialized");

export const { GET, POST } = handlers;
export { auth as middleware } from "@/lib/auth";
