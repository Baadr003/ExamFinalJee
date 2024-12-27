FROM maven:3.8.4-openjdk-17 AS builder

WORKDIR /app

# Copy the pom.xml file first to cache dependencies
COPY pom.xml .
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR file
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]