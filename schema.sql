-- =====================================================
-- Skema Database: Peminjaman Buku Perpustakaan
-- Jalankan di SQL Editor Supabase sebelum menjalankan API
-- =====================================================

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
