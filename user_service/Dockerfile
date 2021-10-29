FROM openjdk:11.0.9.1-jre-slim-buster AS base
EXPOSE 8080
RUN mkdir /app
WORKDIR /app

FROM openjdk:11.0.9.1-jdk-buster AS build
WORKDIR /home/gradle/src
# gradle.properties
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY gradle ./gradle
# Only download dependencies
RUN ./gradlew downloadDependencies --no-daemon
COPY . .
RUN ./gradlew clean build --no-daemon

FROM base AS final
COPY --from=build /home/gradle/src/build/libs/demo-0.0.1-SNAPSHOT.jar .
CMD ["java", "-server", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseG1GC", "-XX:MaxGCPauseMillis=100", "-XX:+UseStringDeduplication", "-jar", "demo-0.0.1-SNAPSHOT.jar"]
