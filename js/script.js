// js/script.js - Penanganan Form DOM & LocalStorage untuk KasirKu

document.addEventListener("DOMContentLoaded", () => {
  // 1. Pilih form dan elemen isian di form.html menggunakan querySelector
  const form = document.querySelector("form");
  const inputNama = document.querySelector("#nama_produk");
  const inputKategori = document.querySelector("#kategori");
  const inputSatuan = document.querySelector("#satuan");
  const inputBarcode = document.querySelector("#barcode");
  const inputHargaBeli = document.querySelector("#harga_beli");
  const inputHargaJual = document.querySelector("#harga_jual");
  const inputStok = document.querySelector("#stok_awal");

  // Buat elemen penampung pesan dinamis secara otomatis di atas tombol / form
  let elemenPesan = document.querySelector("#pesan-feedback");
  if (!elemenPesan && form) {
    elemenPesan = document.createElement("div");
    elemenPesan.id = "pesan-feedback";
    elemenPesan.style.margin = "12px 0";
    elemenPesan.style.fontWeight = "bold";
    form.before(elemenPesan);
  }

  function tampilPesan(teks, error = false) {
    if (elemenPesan) {
      elemenPesan.textContent = teks;
      elemenPesan.style.color = error ? "#ef4444" : "#10b981"; // Merah untuk error, Hijau untuk sukses
    }
  }

  // 2. Tangani event submit + preventDefault
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Mencegah halaman melakukan reload otomatis

      const nama = inputNama ? inputNama.value.trim() : "";
      const hargaJual = inputHargaJual ? Number(inputHargaJual.value) : 0;
      const stok = inputStok ? Number(inputStok.value) : 0;
      const kategori = inputKategori ? inputKategori.options[inputKategori.selectedIndex].text : "Sembako";
      const satuan = inputSatuan ? inputSatuan.value.trim() : "Pcs";
      const sku = inputBarcode ? inputBarcode.value.trim() : "UMKM-SKU";

      // 3. Validasi minimal 2 aturan dengan pesan yang jelas
      if (nama === "") {
        tampilPesan("⚠️ Gagal: Nama produk warung wajib diisi!", true);
        return;
      }

      if (Number.isNaN(hargaJual) || hargaJual <= 0) {
        tampilPesan("⚠️ Gagal: Harga jual kasir harus berupa angka lebih besar dari 0!", true);
        return;
      }

      // Ambil data produk tersimpan dari LocalStorage atau buat array kosong
      let produkList = JSON.parse(localStorage.getItem("produkKasirKu")) || [];

      // Masukkan data baru ke dalam array
      produkList.push({
        nama: nama,
        kategori: kategori,
        satuan: satuan,
        sku: sku,
        harga: hargaJual,
        stok: stok,
        status: "Tersedia"
      });

      // Simpan kembali ke LocalStorage
      localStorage.setItem("produkKasirKu", JSON.stringify(produkList));

      // 5. Kosongkan form dan tampilkan pesan sukses
      form.reset();
      tampilPesan("✅ Sukses: Produk baru berhasil disimpan ke sistem!");
    });
  }

  // 4. Render data ke tabel di index.html menggunakan createElement + textContent
  const tabelBody = document.querySelector("table.data-table tbody");
  if (tabelBody) {
    const produkTersimpan = JSON.parse(localStorage.getItem("produkKasirKu")) || [];

    produkTersimpan.forEach((p) => {
      const tr = document.createElement("tr");

      // Kolom Checkbox
      const tdCheck = document.createElement("td");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      tdCheck.append(cb);
      tr.append(tdCheck);

      // Kolom Nama Produk & SKU
      const tdNama = document.createElement("td");
      const divFlex = document.createElement("div");
      divFlex.style.display = "flex";
      divFlex.style.gap = "12px";
      divFlex.style.alignItems = "center";

      const img = document.createElement("img");
      img.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80";
      img.style.width = "40px";
      img.style.height = "40px";
      img.style.borderRadius = "6px";
      img.style.objectFit = "cover";

      const divInfo = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = p.nama;
      const br = document.createElement("br");
      const small = document.createElement("small");
      small.style.color = "var(--warna-teks-muted)";
      small.textContent = "SKU: " + p.sku;

      divInfo.append(strong, br, small);
      divFlex.append(img, divInfo);
      tdNama.append(divFlex);
      tr.append(tdNama);

      // Kolom Kategori / Satuan
      const tdKat = document.createElement("td");
      tdKat.textContent = p.kategori.split(" ")[0]; // Ambil kata pertama kategori
      const brKat = document.createElement("br");
      const smallKat = document.createElement("small");
      smallKat.style.color = "var(--warna-teks-muted)";
      smallKat.textContent = "Per " + p.satuan;
      tdKat.append(brKat, smallKat);
      tr.append(tdKat);

      // Kolom Harga Jual
      const tdHarga = document.createElement("td");
      const strongHarga = document.createElement("strong");
      strongHarga.textContent = "Rp " + p.harga.toLocaleString("id-ID");
      tdHarga.append(strongHarga);
      tr.append(tdHarga);

      // Kolom Stok
      const tdStok = document.createElement("td");
      const strongStok = document.createElement("strong");
      strongStok.textContent = p.stok;
      tdStok.append(strongStok);
      tr.append(tdStok);

      // Kolom Status Ketersediaan
      const tdStatus = document.createElement("td");
      const spanBadge = document.createElement("span");
      spanBadge.className = "badge badge-success";
      spanBadge.textContent = "● " + p.status;
      tdStatus.append(spanBadge);
      tr.append(tdStatus);

      // Kolom Aksi
      const tdAksi = document.createElement("td");
      tdAksi.textContent = "✏️ 🗑️";
      tr.append(tdAksi);

      // Tempel baris ke dalam <tbody> tabel di index.html
      tabelBody.append(tr);
    });
  }
});