import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { usersRouter } from "./v1/user/userRouter";
import { authRouter } from "./v1/auth/authRouter";

// JWT 설정
const jwtConfig = {
  name: 'jwt',
  secret: process.env.JWT_SECRET || 'your-secret-key',
  exp: '15m' // 15분
};

const refreshJwtConfig = {
  name: 'refreshJwt',
  secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  exp: '7d' // 7일
};

const v1Router = new Elysia({ prefix: "/api/v1" })
.use(bearer())
.use(jwt(jwtConfig))
.use(jwt(refreshJwtConfig))
.use(authRouter)
.guard({
  beforeHandle: ({ bearer, jwt, refreshJwt }) => {
    console.log('bearer', bearer);
    console.log('jwt', jwt);
    console.log('refreshJwt', refreshJwt);
  }
})
.use(usersRouter);


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
