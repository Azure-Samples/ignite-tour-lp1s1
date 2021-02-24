FROM mmcr.microsoft.com/dotnet/core/sdk:2.2 as builder
COPY . /home/
RUN cd /home/ \
    && dotnet clean \
    && dotnet publish -c Release \
    && cd /home/InventoryService.Api/bin/Release/netcoreapp2.1/publish/

FROM mcr.microsoft.com/dotnet/aspnet:2.2 AS runtime
WORKDIR /home/publish/
COPY --from=builder /home/InventoryService.Api/bin/Release/netcoreapp2.1/publish/ .
ENTRYPOINT dotnet InventoryService.Api.dll --urls http://*:$PORT
