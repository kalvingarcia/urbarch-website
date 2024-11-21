'use server'
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation'

export async function navigate(url) {
    redirect(url)
}

export async function setDarkMode(darkMode) {
    (await cookies()).set("urbanDarkMode", darkMode);
}
export async function getDarkMode() {
    return await (await cookies()).get("urbanDarkMode");
}