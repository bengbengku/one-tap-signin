## Getting Started

### backend
```bash
  cd backend
  run => npm install
```
```backend PORT = 3001```

1. Pada file backend/config/config.example.json, silahkan ganti menjadi backend/config/config.json.
    ```bash
    "username": "YOUR USERNAME",
    "password": "YOUR PASSWORD",
    "database": "YOUR DB_NAME",
    "host": "127.0.0.1",
    "dialect": "mysql"
    ```
   isi sesuai data mysql dilocal.

2. Pada file backend/.env.example, silahkan ganti menjadi backend/.env
   ```bash
    TOKEN_SECRET=YOUR TOKEN_SECRET
    GOOGLE_CLIENT_ID=YOUR CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR CLIENT_SECRET
    ``` 
3. Jalankan pada terminal backend ```npx sequelize db:migrate ```


### frontend ReactJs
```bash
  cd frontend
  run => npm install
```
```frontend PORT = 3000```

1. Pada file frontend/.env.example, silahkan ganti menjadi frontend/.env
   ```bash
    REACT_APP_GOOGLE_CLIENT_ID=YOUR CLIENT_ID
    REACT_APP_BACKEND_URL=http://localhost:YOUR_PORT
    ``` 

### Setup One Tap Signin Google To Get Client ID and Client Secret

1. Kunjungi google cloud platform, masuk ke console.
2. Pilih APIs & Services -> Credentials.
3. Pada dashboard Credentials, pilih Create Credentials -> OAuth client ID.
4. lalu isi data:  
   ``` Application type = "Web application"
       Name = "ISI NAME APP"
       - pada kolom Authorized JavaScript origins
       -> tambahkan URI 1 = http://localhost:BACKEND_PORT
       -> tambahkan URI 2 = http://localhost:FRONTEND_PORT
       -> tambahkan URI 3 = http://localhost
5. Copy paste Client ID pada file  frontend/.env dan backend/.env
6. Copy paste Client Secret key pada file backend/.env

