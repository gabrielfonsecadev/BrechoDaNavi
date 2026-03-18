# Stage 1: Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["BrechoApi.csproj", "./"]
RUN dotnet restore "./BrechoApi.csproj"

# Copy the remaining files and build the app
COPY . .
RUN dotnet build "BrechoApi.csproj" -c Release -o /app/build

# Stage 2: Publish Stage
FROM build AS publish
RUN dotnet publish "BrechoApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose the default ASP.NET Core port
EXPOSE 8080

# Run the project
ENTRYPOINT ["dotnet", "BrechoApi.dll"]
