#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
RUN apt update -y 
RUN apt install ffmpeg -y
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["ConvertService/ConvertService.csproj", "ConvertService/"]
COPY ["MessageQueueDTOs/MessageQueueDTOs.csproj", "MessageQueueDTOs/"]
RUN dotnet restore "ConvertService/ConvertService.csproj"
COPY . .
WORKDIR "/src/ConvertService"
RUN dotnet build "ConvertService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ConvertService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ConvertService.dll"]