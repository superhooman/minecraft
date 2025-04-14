echo "Getting SSL certificate for mc.superhooman.co"
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email iam@superhooman.co \
  --agree-tos \
  --no-eff-email \
  -d mc.superhooman.co

echo "Setting up cron job for SSL certificate renewal"
0 3 * * * docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew --webroot --webroot-path=/var/www/certbot && docker compose exec nginx nginx -s reload
