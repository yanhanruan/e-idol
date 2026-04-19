# Backend Architecture & Coding Standards (Go 语言后端规范)

## 1. 技术栈核心 (Tech Stack)
- **Web 框架**: Gin (`github.com/gin-gonic/gin`)
- **ORM**: GORM (`gorm.io/gorm`)
- **数据库**: PostgreSQL

## 2. 目录职责与代码边界 (Directory Responsibilities)
在编写或修改后端代码时，必须严格遵守以下目录的职责划分，**严禁跨层污染**：

- **`cmd/api/`**：入口点。只负责初始化配置、连接数据库、注册路由和启动服务器 `main.go`。禁止包含业务逻辑。
- **`internal/models/`**：数据模型层。只存放 GORM 的 Struct 定义和数据库表结构映射。禁止引入 Gin 相关的包。
- **`internal/database/`**：数据库连接层。负责 PostgreSQL 的初始化和单例管理。
- **`internal/handlers/`**：HTTP 控制器层。
  - **职责**：解析请求参数 (BindJSON/BindQuery)、调用具体的业务逻辑、返回统一格式的 JSON。
  - **规则**：复杂的业务逻辑和庞大的数据库查询应尽量提炼，保持 Handler 的整洁。
- **`internal/routes/`**：路由层。专门负责将 URL 路径绑定到 `handlers` 中的具体函数。
- **`internal/websocket/`**：WebSocket 专属逻辑。处理长连接、消息广播和心跳保活。
- **`pkg/middleware/`**：Gin 中间件。存放鉴权 (Auth)、跨域 (CORS)、日志打印等拦截器逻辑。
- **`pkg/utils/`**：公共工具函数。存放与具体业务无关的纯函数（如密码哈希、JWT 生成、字符串处理）。

## 3. 统一 API 响应规范 (Standard JSON Response)
**所有的 HTTP 响应（无论成功还是失败），必须严格使用以下 JSON 结构返回。** 严禁直接返回裸字符串或非标准结构。

```go
// 参考结构 (需在代码中统一封装响应体)
type Response struct {
    Code    int         `json:"code"`    // 业务状态码 (200 为成功，其他为错误)
    Message string      `json:"message"` // 提示信息
    Data    interface{} `json:"data"`    // 实际数据载荷 (为空时返回 null 或空对象)
}
```