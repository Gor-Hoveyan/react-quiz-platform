export function isLoggedIn(): boolean {
    const token = document.cookie.split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    if (!token) {
        return false;
    }
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    if (Math.floor(Date.now() / 1000) > decodedToken.exp) {
        return false;
    }
    return true;
}