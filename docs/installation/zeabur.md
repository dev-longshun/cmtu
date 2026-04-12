# Zeabur 部署指南（镜像部署）

## 镜像地址

```
ghcr.io/dev-longshun/new-api:latest
```

镜像由 GitHub Actions 自动构建并推送到 GHCR：

- push `main` 分支 → 构建 `beta` 标签
- 打 `v*` tag（如 `v0.1.0`）→ 构建 `latest` 标签

## 部署步骤

### 1. 创建项目

登录 [Zeabur](https://zeabur.com) 后，新建一个 Project。

---

### 2. 添加 PostgreSQL

Add Service → **Databases** → 选择 **PostgreSQL** → 一键部署。

部署完成后，在 PostgreSQL 服务的 **Overview** 页面点击 Connection String 旁的眼睛图标查看连接串：

```
postgresql://root:A5P0OUgl6B9xi3s4MawrqcoWQIC728E1@tpe1.clusters.zeabur.com:24791/zeabur
```

---

### 3. 添加 Redis

Add Service → **Databases** → 选择 **Redis** → 一键部署。

部署完成后，在 Redis 服务的 **Overview** 页面查看连接地址：

```
redis://:E06dRMwBgmvx3o45nkcpSr1l7Hji98G2@tpe1.clusters.zeabur.com:22860
```

---

### 4. 部署 new-api

Add Service → **Docker Image** → 输入上方镜像地址：

```
ghcr.io/dev-longshun/new-api:latest
```

---

### 5. 配置环境变量

在 new-api 服务的 **Variable** 面板中逐条添加：

**SQL_DSN**
```
postgresql://root:A5P0OUgl6B9xi3s4MawrqcoWQIC728E1@tpe1.clusters.zeabur.com:24791/zeabur
```

**REDIS_CONN_STRING**
```
redis://:E06dRMwBgmvx3o45nkcpSr1l7Hji98G2@tpe1.clusters.zeabur.com:22860
```

**TZ**
```
Asia/Shanghai
```

**SESSION_SECRET**
```
（填一段随机字符串，必须修改）
```

**ERROR_LOG_ENABLED**
```
true
```

**BATCH_UPDATE_ENABLED**
```
true
```

---

### 6. 挂载持久化卷

在 new-api 服务的 Volumes 面板中添加：

- Mount Directory：`/data`
- 作用：保存 SQLite 数据（若使用 PostgreSQL 可选配，建议仍然挂载用于日志等）

---

### 7. 开放网络端口

在 Networking 面板中开放端口 `3000`。

---

### 8. 绑定域名（可选）

在 Networking → Domain 中：

- 使用 Zeabur 免费子域名（`xxx.zeabur.app`），或
- 绑定自己的域名，按提示在域名注册商处添加 CNAME 记录

Zeabur 会自动签发 SSL 证书。

---

## 不需要配置的项

- **Dockerfile** — 预构建镜像部署不适用
- **启动命令（Command）** — 镜像内置，无需填写

---

## 首次登录

服务启动后访问你的域名，默认管理员账号：

- 用户名：`root`
- 密码：`123456`

**登录后请立即修改密码。**

---

## 常见问题

### 服务启动后无法连接数据库

检查 `SQL_DSN` 中的 host 是否填写了 Zeabur 内网域名（不是 `localhost`），以及 PostgreSQL 服务是否已正常运行。

### Redis 连接失败

确认 `REDIS_CONN_STRING` 格式正确，内网 host 与 Redis 服务名一致。

### 重启后数据丢失

确认已挂载 `/data` 持久化卷，且使用了外部数据库（PostgreSQL）而非默认 SQLite。
