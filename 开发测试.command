#!/bin/bash
cd "$(dirname "$0")"

ensure_brew() {
  if command -v brew >/dev/null 2>&1; then
    return 0
  fi

  echo "未检测到 Homebrew，开始自动安装（可能会要求输入 macOS 密码）..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
  if [ -x /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi

  command -v brew >/dev/null 2>&1
}

ensure_bun() {
  if command -v bun >/dev/null 2>&1; then
    return 0
  fi

  echo "未检测到 bun，开始自动安装..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"

  command -v bun >/dev/null 2>&1
}

ensure_go() {
  if command -v go >/dev/null 2>&1; then
    return 0
  fi

  echo "未检测到 Go，开始自动安装..."
  ensure_brew || return 1
  brew install go || return 1
  command -v go >/dev/null 2>&1
}

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "未检测到 Docker，开始自动安装 Docker Desktop..."
    ensure_brew || return 1
    brew install --cask docker || return 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo "未检测到 docker compose 插件，开始自动安装..."
    ensure_brew || return 1
    brew install docker-compose || return 1
  fi

  if ! docker info >/dev/null 2>&1; then
    echo "正在启动 Docker Desktop..."
    open -a Docker >/dev/null 2>&1 || open /Applications/Docker.app >/dev/null 2>&1 || true
    for i in {1..120}; do
      if docker info >/dev/null 2>&1; then
        return 0
      fi
      sleep 1
    done
    return 1
  fi

  return 0
}

echo "正在执行 new-api 开发测试..."

echo "[0/4] 准备依赖环境（Go / bun / Docker）"
if ! ensure_go; then
  echo "Go 安装或加载失败。"
  read -p "按回车键退出..."
  exit 1
fi
if ! ensure_bun; then
  echo "bun 安装或加载失败。"
  read -p "按回车键退出..."
  exit 1
fi
if ! ensure_docker; then
  echo "Docker 环境准备失败，请检查网络、安装权限或 Docker Desktop 状态。"
  read -p "按回车键退出..."
  exit 1
fi

echo "[1/4] 前端构建 (bun run build)"
cd web || exit 1
if [ ! -d node_modules ]; then
  bun install 2>&1
  if [ $? -ne 0 ]; then
    echo "前端依赖安装失败，请检查网络或 bun 配置。"
    read -p "按回车键退出..."
    exit 1
  fi
fi
bun run build 2>&1
if [ $? -ne 0 ]; then
  echo "前端构建失败，请检查代码。"
  read -p "按回车键退出..."
  exit 1
fi
cd .. || exit 1

echo "[2/4] 后端编译 (go build)"
go build -o new-api-dev . 2>&1
if [ $? -ne 0 ]; then
  echo "后端编译失败，请先修复后重试。"
  read -p "按回车键退出..."
  exit 1
fi

echo "[3/4] 启动基础设施（postgres + redis）"
# 停掉旧的本地进程和可能占 3000 端口的 Docker 容器
pkill -f new-api-dev 2>/dev/null || true
docker stop new-api 2>/dev/null || true
docker compose -f docker-compose.dev.yml up -d --remove-orphans --force-recreate
if [ $? -ne 0 ]; then
  echo "Docker 启动失败，请检查 Docker Desktop 状态。"
  read -p "按回车键退出..."
  exit 1
fi

# 等待 postgres 就绪
for i in {1..30}; do
  if docker exec postgres pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "[4/4] 启动 new-api 本地服务"

export SQL_DSN="postgresql://postgres:123456@127.0.0.1:5433/new-api?sslmode=disable"
export REDIS_CONN_STRING="redis://127.0.0.1"
export TZ="Asia/Shanghai"
export ERROR_LOG_ENABLED="true"
export BATCH_UPDATE_ENABLED="true"

mkdir -p logs
./new-api-dev --log-dir ./logs &
NEW_API_PID=$!

# 健康检查
OK=0
for i in {1..45}; do
  if /usr/bin/curl -fsS "http://127.0.0.1:3000/api/status" >/dev/null 2>&1; then
    OK=1
    break
  fi
  sleep 1
done

echo ""
if [ "$OK" -eq 1 ]; then
  echo "开发测试通过，服务可用。"
else
  echo "服务已启动，但健康检查未通过，请查看 logs/ 目录。"
fi

echo "  URL: http://127.0.0.1:3000"
echo "  API Base URL: http://127.0.0.1:3000/v1"
echo "  分支: $(git branch --show-current)"
echo "  PID: $NEW_API_PID"
echo ""

open "http://127.0.0.1:3000" >/dev/null 2>&1 || true

read -p "按回车键停止服务并退出..."
kill $NEW_API_PID 2>/dev/null || true
