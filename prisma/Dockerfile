FROM mongo:5.0
COPY keyfile.pem /data/keyfile.pem
RUN mkdir -p /data/logs && chmod 777 -R /data/logs
RUN chmod 400 /data/keyfile.pem
RUN chown 999:999 /data/keyfile.pem
RUN apt-get update && apt-get install netcat -y
COPY init.sh /docker-entrypoint-initdb.d/init.sh