export async function GET(request) {
    return new Response("Server stopped from taking a nap!", {
        "status": 200
    });
}