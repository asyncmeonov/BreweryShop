# Alpine Linux with OpenJDK JRE
FROM openjdk:8-jre-alpine
EXPOSE $PORT
ARG JAR_FILE=shop-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","-Dspring.profiles.active=prod","/app.jar"]