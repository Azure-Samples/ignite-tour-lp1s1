FROM mcr.microsoft.com/dotnet/core/sdk:2.1 AS builder
WORKDIR /app

# caches restore result by copying csproj file separately
COPY *.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish --output /app/ --configuration Release --self-contained -r alpine-x64

# Stage 2
FROM mcr.microsoft.co/dotnet/runtime-deps:2.1-alpine
WORKDIR /app
COPY --from=builder /app .

EXPOSE 80
ENV PORT 80

ENTRYPOINT ["sh", "-c", "./InventoryService.Api --urls=http://*:$PORT"]
