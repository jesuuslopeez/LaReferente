# Build stage
FROM gradle:8.11-jdk21 AS build
WORKDIR /app

# Copiar archivos de configuración de Gradle
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Copiar código fuente
COPY src ./src

# Compilar la aplicación usando el wrapper
RUN ./gradlew build -x test --no-daemon

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
