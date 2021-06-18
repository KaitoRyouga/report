docker-compose up -d

docker tag report_frontend kaitoryouga/report_frontend:latest
docker tag report_backend kaitoryouga/report_backend:latest

docker push kaitoryouga/report_frontend:latest
docker push kaitoryouga/report_backend:latest