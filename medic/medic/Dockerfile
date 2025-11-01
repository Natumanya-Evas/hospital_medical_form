FROM tomcat:9.0-jdk11-openjdk-slim-buster

WORKDIR /medic

# Install Maven to build your WAR
RUN apt-get update && apt-get install -y curl unzip && \
    curl -o /tmp/maven.zip https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.zip && \
    unzip /tmp/maven.zip -d /opt && rm /tmp/maven.zip && \
    ln -s /opt/apache-maven-3.6.3 /opt/maven && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV MAVEN_HOME /opt/maven
ENV PATH $MAVEN_HOME/bin:$PATH

COPY . /medic

RUN mvn -f /medic/medic-webapp/pom.xml clean package -DskipTests
RUN cp /medic/medic-webapp/target/medic.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
