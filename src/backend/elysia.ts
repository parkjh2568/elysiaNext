import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { usersRouter } from "./v1/user/userRouter";
import { authRouter } from "./v1/auth/authRouter";

const v1Router = new Elysia({ prefix: "/api/v1" })
.use(usersRouter)
.use(authRouter);

export const app = new Elysia({ adapter: node() })
  .get("/health", () => {
    console.log("health check");
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
