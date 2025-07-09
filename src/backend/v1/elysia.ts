import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { usersRouter } from "./user/userRouter";

const v1Router = new Elysia({ prefix: "/v1" })
  .use(usersRouter);

export const app = new Elysia({ prefix: "/api", adapter: node() })
  .get("/health", () => {
    return {
      success: true,
      message: "API 서버가 정상적으로 작동 중입니다.",
      timestamp: new Date().toISOString(),
    };
  })
  .use(v1Router)
  .onError(({ error, code }) => {
    console.error("Elysia Error:", error);

    if (code === "VALIDATION") {
      return {
        success: false,
        error: "입력값이 올바르지 않습니다.",
        details: error.message,
      };
    }

    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  });

export type App = typeof app;
