# Credential Manager - Frontend

Frontend aplikasi manajemen kredensial dan kata sandi berbasis web yang dibangun menggunakan **Nuxt 4** dan **Ant Design Vue**.

---

## Tech Stack

* **Framework:** Nuxt 4 (Vue 3, Composition API)
* **UI Components:** Ant Design Vue
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios
* **Package Manager / Runtime:** Bun atau Node.js v18+

---

## Prerequisites

* [Bun](https://bun.sh/) (disarankan) atau Node.js v18+
* Backend service sudah berjalan (default: `http://localhost:3002`)

---

## Konfigurasi Environment

Salin contoh file `.env` jika ingin mengubah URL endpoint backend:

```env
NUXT_PUBLIC_API_URL=http://localhost:3002
```

---

## Menjalankan Secara Lokal

1. Install dependensi:
```bash
bun install
```

2. Jalankan development server:
```bash
bun run dev
```

Aplikasi dapat diakses di browser melalui `http://localhost:3000`.

> **Akun Default (Database Seeder):**
> * **Email:** `admin@example.com`
> * **Password:** `password123`

3. Build production & preview:
```bash
bun run build
bun run preview
```

---

## Menjalankan dengan Docker

```bash
docker compose up --build -d
```

---

## Fitur Antarmuka

* **Autentikasi:** Halaman register, login, dan route guard middleware berbasis token JWT.
* **Credential Management:** Tabel kredensial dengan filter kategori/group, fitur show/hide password, dan copy to clipboard.
* **Dynamic Menu Group:** Group yang dibuat otomatis tampil secara reaktif di menu navigasi sidebar.
* **Category Management:** Manajemen kategori akun.
* **Pencarian & Pagination:** Pencarian teks dan pagination server-side.
* **Reusable Components:** Komponen reusable seperti `DataTable` dan `ConfirmModal`.
