FROM mcr.microsoft.com/dotnet/core/sdk:2.2

COPY . /home/

RUN cd /home/ \
    && dotnet clean \
    && dotnet publish -c Release \
    && cd /home/InventoryService.Api/bin/Release/netcoreapp2.1/publish/

WORKDIR /home/InventoryService.Api/bin/Release/netcoreapp2.1/publish/

ENTRYPOINT dotnet InventoryService.Api.dll --urls http://*:$PORT
