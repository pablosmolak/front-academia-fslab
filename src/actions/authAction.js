"use server";

import { fetchApi } from "../utils/fetchApi";

export async function getUserInfos() {
    const response = await fetchApi("/login/check", "GET", null, null, {
        next: {
            tags: ["getUserInfos"],
        }
    });
    
    if (!response?.error) {
        return response?.data[0]?.payload;
    }
}
