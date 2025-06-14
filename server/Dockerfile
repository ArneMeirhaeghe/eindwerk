# ---------- Build Stage ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project file en restore
COPY server/server.csproj ./server/
WORKDIR /app/server
RUN dotnet restore

# Copy rest van de code
COPY server/. ./
RUN dotnet publish -c Release -o /out

# ---------- Runtime Stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

ENTRYPOINT ["dotnet", "server.dll"]
