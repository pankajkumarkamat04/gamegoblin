import { buildAPIURL, getAPIHeaders } from "@/lib/utils";
import Cookies from "js-cookie";

export interface NewsItem {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  priority: string;
  status: string;
  tags: string[];
  isPinned: boolean;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface NewsListResult {
  success: boolean;
  data?: {
    news: NewsItem[];
  };
  error?: string;
}

function getAuthToken(): string | undefined {
  let token = Cookies.get("user_token");
  if (!token && typeof window !== "undefined") {
    try {
      token = window.localStorage.getItem("user_token") || undefined;
    } catch {
      token = undefined;
    }
  }
  return token;
}

export async function getNewsList(
  page = 1,
  limit = 20
): Promise<NewsListResult> {
  const token = getAuthToken();

  try {
    const qs = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const url = buildAPIURL(`/api/v1/news/list?${qs.toString()}`);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...getAPIHeaders(false),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const raw = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: raw?.message || "failed_to_load_news",
      };
    }

    const news = raw?.data?.news || raw?.news || [];
    return {
      success: true,
      data: { news },
    };
  } catch (e: any) {
    return {
      success: false,
      error: e?.message || "news_error",
    };
  }
}

