import { handlers, auth } from "@/lib/auth";

export const { GET, POST } = handlers;
export { auth as middleware } from "@/lib/auth";
