import { redirect } from "@sveltejs/kit";

export function GET() {
    // Redirects /resume directly to /resume.pdf
    throw redirect(307, '/resume.pdf');
}
