import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || "请求失败";
    return Promise.reject(new Error(message));
  },
);

export async function chatStream(
  message: string,
  onChunk: (content: string) => void,
  onComplete: (data: any) => void,
  onError: (error: Error) => void,
) {
  try {
    const response = await fetch("/api/travel/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("无法读取响应流");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const dataStr = trimmed.slice(5).trim();
        if (dataStr === "[DONE]") return;

        try {
          const data = JSON.parse(dataStr);
          if (data.type === "chunk" && data.content) {
            onChunk(data.content);
          } else if (data.type === "complete") {
            onComplete(data.data);
          }
        } catch {
          // skip invalid JSON
        }
      }
    }
  } catch (error) {
    onError(error as Error);
  }
}
