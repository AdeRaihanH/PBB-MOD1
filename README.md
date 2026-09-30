# Library Loan API - Peminjaman Buku Perpustakaan

Proyek ini adalah RESTful API sederhana untuk layanan **pencatatan peminjaman buku perpustakaan**. API dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase** (PostgreSQL), serta dideploy ke **Vercel**. Proyek ini merupakan bagian dari responsi Praktikum Pemrograman Perangkat Bergerak (PPB).

> **Link deployment Vercel:** https://pbb-mod-1-kel16-responsi.vercel.app/

## Deskripsi Umum & Tujuan

API ini menyediakan fitur operasi **CRUD** (Create, Read, Update, Delete) untuk data peminjaman buku oleh anggota perpustakaan, meliputi:

- **Members** — pengelolaan data anggota perpustakaan.
- **Books** — pengelolaan data buku.
- **Loans** — pencatatan peminjaman buku oleh anggota, termasuk status peminjaman.

Selain CRUD, API juga mendukung **fitur filter query** untuk menyaring data peminjaman berdasarkan status, contoh: `GET /loans?status=Terlambat`.

## Struktur Data / Schema

Buat tabel berikut di **SQL Editor Supabase** Anda (atau jalankan file [`schema.sql`](./schema.sql)):

```sql
-- Tabel anggota perpustakaan
create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text
);

-- Tabel buku
create table books (
  id uuid primary key default gen_random_uuid(),
  isbn text unique,
  title text not null,
  author text,
  publisher text,
  year integer,
  stock integer default 0
);

-- Tabel peminjaman buku
create table loans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  book_id uuid references books(id) on delete cascade,
  loan_date date,
  due_date date,
  return_date date,
  status text default 'Dipinjam'
    check (status in ('Dipinjam', 'Terlambat', 'Dikembalikan'))
);
```

## Endpoint API

| Method | Endpoint            | Deskripsi                                    |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/api/members`      | Menampilkan semua anggota                    |
| GET    | `/api/members/:id`  | Menampilkan anggota berdasarkan id           |
| POST   | `/api/members`      | Menambah anggota                             |
| PUT    | `/api/members/:id`  | Mengubah data anggota                        |
| DELETE | `/api/members/:id`  | Menghapus anggota                            |
| GET    | `/api/books`        | Menampilkan semua buku                       |
| GET    | `/api/books/:id`    | Menampilkan buku berdasarkan id              |
| POST   | `/api/books`        | Menambah buku                                |
| PUT    | `/api/books/:id`    | Mengubah data buku                           |
| DELETE | `/api/books/:id`    | Menghapus buku                               |
| GET    | `/api/loans`        | Menampilkan semua peminjaman                 |
| GET    | `/api/loans?status=Terlambat` | Memfilter peminjaman berdasarkan status |
| GET    | `/api/loans/:id`    | Menampilkan peminjaman berdasarkan id        |
| POST   | `/api/loans`        | Menambah peminjaman                          |
| PUT    | `/api/loans/:id`    | Mengubah data peminjaman                     |
| DELETE | `/api/loans/:id`    | Menghapus peminjaman                         |

## Contoh Request dan Response

### 1. Menambah Anggota — `POST /api/members`

Request:

```json
{
  "name": "Ade Raihan Hanafi",
  "email": "aderaihanh@students.undip.ac.id",
  "phone": "081393055199",
  "address": "Tembalang"
}
```

Response (201):

```json
{
  "id": "971721a3-b48d-4f89-9824-5cc287fcec5e",
  "name": "Ade Raihan Hanafi",
  "email": "aderaihanh@students.undip.ac.id",
  "phone": "081393055199",
  "address": "Tembalang"
}
```

### 2. Menambah Buku — `POST /api/books`

Request:

```json
{
  "isbn": "978-602-03-1234-6",
  "title": "Belajar Praktikum PPB",
  "author": "Are",
  "publisher": "Gramedia",
  "year": 2020,
  "stock": 5
}
```

Response (201):

```json
{
  "id": "fd8b9d2b-7617-4018-af1e-4efeab8ca7f8",
  "isbn": "978-602-03-1234-6",
  "title": "Belajar Praktikum PPB",
  "author": "Are",
  "publisher": "Gramedia",
  "year": 2020,
  "stock": 5
}
```

### 3. Menambah Peminjaman — `POST /api/loans`

Request:

```json
{
  "member_id": "971721a3-b48d-4f89-9824-5cc287fcec5e",
  "book_id": "fd8b9d2b-7617-4018-af1e-4efeab8ca7f8",
  "loan_date": "2024-05-01",
  "due_date": "2024-05-08",
  "status": "Dipinjam"
}
```

Response (201):

```json
{
  "id": "efd04a0e-d97c-4159-820b-f52b5db8c6ae",
  "member_id": "971721a3-b48d-4f89-9824-5cc287fcec5e",
  "book_id": "fd8b9d2b-7617-4018-af1e-4efeab8ca7f8",
  "loan_date": "2024-05-01",
  "due_date": "2024-05-08",
  "return_date": null,
  "status": "Dipinjam"
}
```

### 4. Menampilkan Semua Peminjaman — `GET /api/loans`

Response (200):

```json
[
  {
    "id": "efd04a0e-d97c-4159-820b-f52b5db8c6ae",
    "loan_date": "2024-05-01",
    "due_date": "2024-05-08",
    "return_date": null,
    "status": "Dipinjam",
    "members": { "id": "971721a3-b48d-4f89-9824-5cc287fcec5e", "name": "Ade Raihan Hanafi" },
    "books": { "id": "fd8b9d2b-7617-4018-af1e-4efeab8ca7f8", "title": "Belajar Praktikum PPB" }
  },
  {
    "id": "a7c8cc1a-eb63-4a56-bad7-d69d605793ce",
    "loan_date": "2024-04-20",
    "due_date": "2024-04-27",
    "return_date": null,
    "status": "Terlambat",
    "members": { "id": "971721a3-b48d-4f89-9824-5cc287fcec5e", "name": "Ade Raihan Hanafi" },
    "books": { "id": "41fcbcb4-b139-4d47-882d-95b69687fd93", "title": "Cara Menjadi Hacker" }
  }
]
```

### 5. Filter Peminjaman Terlambat — `GET /api/loans?status=Terlambat`

Response (200):

```json
[
  {
    "id": "a7c8cc1a-eb63-4a56-bad7-d69d605793ce",
    "loan_date": "2024-04-20",
    "due_date": "2024-04-27",
    "return_date": null,
    "status": "Terlambat",
    "members": { "id": "971721a3-b48d-4f89-9824-5cc287fcec5e", "name": "Ade Raihan Hanafi" },
    "books": { "id": "41fcbcb4-b139-4d47-882d-95b69687fd93", "title": "Cara Menjadi Hacker" }
  }
]
```

### 6. Mengembalikan Buku — `PUT /api/loans/:id`

Request:

```json
{
  "return_date": "2024-05-10",
  "status": "Dikembalikan"
}
```

Response (200):

```json
{
  "id": "efd04a0e-d97c-4159-820b-f52b5db8c6ae",
  "member_id": "971721a3-b48d-4f89-9824-5cc287fcec5e",
  "book_id": "fd8b9d2b-7617-4018-af1e-4efeab8ca7f8",
  "loan_date": "2024-05-01",
  "due_date": "2024-05-08",
  "return_date": "2024-05-10",
  "status": "Dikembalikan"
}
```

### 7. Menghapus Peminjaman — `DELETE /api/loans/:id`

Response (200):

```json
{
  "message": "Loan deleted successfully"
}
```

## Panduan Instalasi & Cara Menjalankan Lokal

### Persyaratan

- [Node.js](https://nodejs.org/) (versi 16 atau lebih baru)
- Akun [Supabase](https://supabase.com/)
- [Postman](https://www.postman.com/) (untuk pengujian API)

### Langkah Instalasi

1. **Clone repositori**

   ```bash
   git clone https://github.com/AdeRaihanH/PBB-MOD1.git
   cd PBB-MOD1
   ```

2. **Instal dependensi**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**

   Buat file `.env` di folder utama dengan isi:

   ```env
   SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   SUPABASE_KEY=anon-public-key-anda
   PORT=3000
   ```

   Ganti `SUPABASE_URL` dan `SUPABASE_KEY` dengan kredensial dari menu **Project Settings -> API** di dashboard Supabase.

4. **Buat tabel di Supabase**

   Jalankan query pada bagian [Struktur Data / Schema](#struktur-data--schema) di SQL Editor Supabase.

5. **Jalankan server**

   ```bash
   npm run dev      # development (auto-restart)
   # atau
   npm start        # production
   ```

   Server berjalan di `http://localhost:3000`.

## Deployment ke Vercel

1. Push proyek ke GitHub.
2. Import repository di [Vercel](https://vercel.com/).
3. Tambahkan environment variables `SUPABASE_URL` dan `SUPABASE_KEY` di pengaturan proyek Vercel.
4. Deploy.

**Link hasil deployment:** https://pbb-mod-1-kel16-responsi.vercel.app/

**Base URL (untuk pengujian Postman):** `https://pbb-mod-1-kel16-responsi.vercel.app`
