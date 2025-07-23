// interfaces/terms.interface.ts
// terms.interface.ts
export interface ListItem {
  id: string;
  content: string;
  subItems?: string[];
}

export interface Section {
  id: string;
  title: string;
  items: ListItem[];
}

export interface ContentList {
  id: string;
  title: string;
  link: string;
}

// terms-content.ts
export const sections: Section[] = [
  {
    id: '1',
    title: 'Definisi',
    items: [
        {
            id: '1.1',
            content: 'Pakdome, adalah singkatan dari Paket Domestik yang merupakan aplikasi jasa pengiriman domestic yang masih terintegrasi dengan aplikasi Abang Express ( sebuah aplikasi untuk pengiriman ekspor)'
          },
          {
            id: '1.2',
            content: 'Pakdome adalah sebuah aplikasi berbasis integrasi sistem yang di dalamnya mengintegrasikan beberapa vendor jasa pengiriman domestic yang ada di Indonesia. Sehingga salah satu keunggulan pakdome adalah kemampuan untuk bisa memberikan pilihan jasa pengiriman domestic yang menguntungkan bagi konsumen.'
          },
          {
            id: '1.3',
            content: 'Pakdome bekerja berdasarkan sistem yang telah di integrasikan antara sistem utama yang ada di Kantor Pusat PT....................................... ( apakah nanti PT untuk pakdome sama dengan Abang Express atau berbeda. Kalau sama tinggal bagian yang kosong di isi dengan PT Pasti Global Ekspresindo.'
          },
          {
            id: '1.4',
            content: 'Kiriman adalah sebuah paket yang berbentuk barang atau dokumen yang di kirimkan oleh pengirim melalui aplikasi Pakdome sesuai dengan ketentuan yang telah di buat oleh manajemen Pakdome.'
          },
          {
            id: '1.5',
            content: 'Pengirim adalah seseorang yang mengirimkan barang atau dokumen yang di kirimkan menggunakan aplikasi Pakdome ke tujuan yang telah di tentukan di awal.'
          },
          {
            id: '1.6',
            content: 'Penerima adalah orang atau institusi (Badan) yang namanya tercantum dalam sebuah paket yang di kirimkan melalui aplikasi Pakdome sesuai dengan ketentuan yang di tetapkan oleh manajemen Pakdome.'
          },
          {
            id: '1.7',
            content: 'Layanan Pengiriman adalah jenis layanan yang ada di aplikasi Pakdome yang diberikan oleh aplikasi Pakdome dan bisa di pilih oleh konsumen sesuai dengan kebutuhan yang diinginkan oleh konsumen.'
          },
          {
            id: '1.8',
            content: 'Syarat Standar Pengiriman adalah sebuah ketentuan yang harus di taati atau di ikuti oleh semua konsumen yang ingin menggunakan aplikasi Pakdome dalam pengiriman ke seluruh Indonesia.'
          },
          {
            id: '1.9',
            content: 'Hari kerja merupakan :',
            subItems: [
              'Hari Kalender adalah hari Senin sampai dengan hari Minggu sepanjang tahun,',
              'Termasuk di dalamnya Hari Raya dan Hari Libur Nasional.'
            ]
          },
          {
              id: '1.10',
              content: 'Syarat Standar Pengiriman adalah sebuah ketentuan  yang harus di taati atau di ikuti oleh semua konsumen yang ingin menggunakan aplikasi Pakdome dalam pengiriman ke seluruh Indonesia.'
            },
    ]
  },
  {
    id: '2',
    title: 'Ketentuan Standar Pengiriman',
    items: [
      {
        id: '2.1',
        content: 'Secara umum standar pengiriman barang atau dokumen harus mengikuti ketentuan yang telah di tetapkan oleh manajemen Pakdome. Yang mana ketentuannya adalah berdasarkan SOP pengiriman yang berlaku di aplikasi Pakdome.'
      },
      {
        id: '2.2',
        content: 'Layanan pengiriman yang di berikan oleh aplikasi Pakdome adalah :',
        subItems: [
          'Layanan pengiriman ke seluruh wilayah Indonesia dengan menyesuaikan layanan yang diberikan oleh para vendor yang bekerjasama dengan aplikasi Pakdome.',
          'Layanan pengiriman berdasarkan order yang di buat dalam aplikasi Pakdome. Jika ada perubahan order atau ingin melakukan cancel pengiriman harus sesuai dengan ketentuan  yang pada SOP pengiriman dari aplikasi Pakdome.',
          'Layanan pengiriman  akan berbeda waktu tempuhnya dengan menyesuaikan waktu tempuh yang terdapat pada ketentuan layanan dan vendor pengiriman local  yang di pilih dalam aplikasi Pakdome.',
          'Ketentuan lain  yang belum termasuk dalam pengaturan Standar Pengiriman aplikasi Pakdome akan di jelaskan atau di atur terpisah namun tetap menjadi satu kesatuan dengan Syarat dan Ketentuan dari aplikasi Pakdome.'
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Tata Cara Pengiriman',
    items: [
      {
        id: '3.1',
        content: 'Layanan pengiriman dengan aplikasi Pakdome dapat dilakukan di kantor Pusat Pakdome atau di Kantor Agen Pakdome serta mereka yang memiliki atau memegang aplikasi Pakdome'
      },
      {
        id: '3.2',
        content: 'Layanan dapat di lakukan di tempat seperti poin 3.1 tetapi untuk penjemputan barang bisa di lokasi sesuai dengan ketentuan dari point 3.1 atau di lokasi yang sudah di tentukan pada saat konsumen membuat order melalui aplikasi Pakdome.'
      },
      {
        id: '3.3',
        content: 'Pihak pemegang Aplikasi Pakdome akan menginformasikan ke vendor yang di pilih oleh konsumen ketika barang atau dokumen yang sudah di pesan belum juga di ambil oleh vendor yang di pilih.'
      },
      {
        id: '3.4',
        content: 'Pihak vendor akan menjalankan kiriman barang atau dokumen sesuai dengan pilihan jasa atau service yang di pilih melalui aplikasi Pakdome.'
      },
      {
        id: '3.5',
        content: 'Setiap pengiriman barang atau dokumen akan di berikan tanda berupa resi / bukti pengiriman yang dapat di pergunakan jika suatu ketika ada masalah yang berhubungan dengan kiriman yang terlambat atau ada masalah di dalam pengantaran ke alamat tujuan.'
      }
    ]
  },
  {
    "id": "4",
    "title": "Pemeriksaan Kiriman",
    "items": [
      {
        "id": "4.1",
        "content": "Sebelum melakukan pengiriman, maka pemegang aplikasi Pakdome akan melakukan beberapa hal yang berhubungan dengan paket/ dokumen yang akan di kirim :",
        "subItems": [
          "Pemegang aplikasi Pakdome akan melakukan pengecekan terhadap kesesuaian antara isi kiriman dengan informasi yang ada dalam order pengiriman.",
          "Pemegang aplikasi Pakdome akan menilai spesifikasi dari barang atau dokumen yang akan di kirimkan agar tahu berat riil dari produk yang akan di kirimkan.",
          "Pemegang aplikasi Pakdome bisa menolak barang atau dokumen ketika informasinya tidak sesuai dengan kondisi barang",
          "Pemegang aplikasi Pakdome akan mengembalikan barang atau dokumen yang di rasa tidak pas atau tidak sesuai dengan kondisi alamat yang dituju."
        ]
      },
      {
        "id": "4.2",
        "content": "Pemegang aplikasi Pakdome tidak bertanggungjawab terhadap barang yang di serahkan oleh konsumen jika ternyata isinya tidak sesuai dengan keterangan paket yang disampaikan melalui order pemesanan."
      },
      {
        "id": "4.3",
        "content": "Manajemen aplikasi Pakdome bertanggung jawab terhadap barang yang di kirimkan dari mulai barang atau dokumen telah di serahkan kepada pemegang aplikasi Pakdome."
      },
      {
        "id": "4.4",
        "content": "Pengirim sebaiknya mengirimkan atau memberikan beberapa data yang berhubungan dengan data data berikut : informasi data Pengirim dan Penerima pada kemasan Kiriman dengan lengkap dan benar (nama, alamat, kota, kecamatan, kelurahan, kode pos dan nomor telepon)."
      },
      {
        "id": "4.5",
        "content": "Jika terjadi masalah seperti misalnya kiriman tidak sampai atau hilang atau rusak sampai di tujuan, maka konsumen berhak untuk meminta penjelasan dari manajemen Pakdome. Sehingga nanti prosedurnya manajemen Pakdome akan meminta informasi dari vendor yang di pilih oleh konsumen terkait pengiriman barang atau dokumen tersebut."
      },
      {
        "id": "4.6",
        "content": "Manajemen akan meminta tanggapan atau informasi ketika terjadi masalah yang berhubungan dengan kesalahan vendor aplikasi Pakdome sehingga merugikan consumen yang menggunakan aplikasi Pakdome."
      }
    ]
  },
  {
    "id": "5",
    "title": "Kiriman yang Dilarang",
    "items": [
      {
        "id": "5.1",
        "content": "Manajemen Pakdome tidak berkenan atau tidak bersedia untuk mengiriman barang atau dokumen yang memang secara ketentuan di larang atau tidak di perbolehkan di kirim melalui aplikasi Pakdome."
      },
      {
        "id": "5.2",
        "content": "Manajemen Pakdome tidak bersedia atau di larang mengirimkan barang sesuai dengan ketentuan pelarangan pengiriman barang atau dokumen seperti misalnya : barang berbahaya yang mudah meledak atau terbakar, narkotika, psikotropika, senjata api, senjata tajam, emas, perangko, barang curian, cek, bilyet giro, uang tunai, money order, traveller's cheque, benda yang melanggar kesusilaan dan/atau barang lainnya yangmenurut perundang undangan dinyatakan sebagai barang terlarang."
      },
      {
        "id": "5.3",
        "content": "Manajemen Pakdome akan segera mengambil Langkah ketika di ketahui atau di indikasikan ada kiriman barang atau dokumen yang melanggar ketentuan seperti point : 5.2 dan 5.3 sebagai Langkah antisipasi agar tidak terjadi masalah."
      }
    ]
  },
  {
    "id": "6",
    "title": "Jaminan Kepemilikan Barang/Dokumen",
    "items": [
      {
        "id": "6.1",
        "content": "Manajemen Pakdome akan menjamin bahwa barang atau dokumen yang akan di kirimkan adalah barang atau dokumen yang berasal dari pemilik yang sah dan dapat di pertanggungjawabkan."
      },
      {
        "id": "6.2",
        "content": "Manajemen Pakdome akan menjamin bahwa memang barang atau dokumen yang akan di kiriman bukan barang yang terlarang atau melanggar hukum. Atau barang atau dokumen yang mendapatkannya dari hal yang tidak benar ( barang hasil penipuan atau korupsi tidak di perkenankan untuk di kirimkan )."
      },
      {
        "id": "6.3",
        "content": "Manajemen Pakdome akan berdiskusi atau bermusyarakat baik kepada konsumen yang menggunakan aplikasi Pakdome atau dengan vendor pengiriman barang atau dokumen ketika ada masalah dengan barang atau dokumen tersebut terjadi kendala di lapangan."
      }
    ]
  },
  {
    "id": "7",
    "title": "Tarif Kepemilikan Barang/Dokumen",
    "items": [
      {
        "id": "7.1",
        "content": "Manajemen Pakdome berhak dan punya kewenangan untuk menentukan perubahan atau revisi dari tarif yang telah di tetapkan oleh vendor jasa pengiriman domestic. Artinya bukan mengganti tetapi menginformasikan bahwa ada perubahan tarif yang di sebutnya dalam aplikasi Pakdome."
      },
      {
        "id": "7.2",
        "content": "Manajemen Pakdome juga akan menginformasikan kepada pemegang aplikasi Pakdome ketika ada perubahan discount dari angka yang di berikan kepada vendor yang sudah bekerjasama dengan manajemen Pakdome."
      }
    ]
  },
  {
    "id": "8",
    "title": "Asuransi",
    "items": [
      {
        "id": "8.1",
        "content": "Asuransi akan di kenakan dengan melihat ketentuan yang di miliki oleh vendor jasa pengiriman domestic. Sehingga pihak manajemen Pakdome hanya mengikuti ketentuan yang di sampaikan oleh vendor jasa pengiriman dalam negeri."
      },
      {
        "id": "8.2",
        "content": "Asuransi pengiriman akan di hitung berdasarkan ketentuan yang di buat oleh vendor jasa pengiriman domestic."
      }
    ]
  },
  {
    "id": "9",
    "title": "Biaya Ganti Rugi",
    "items": [
      {
        "id": "9.1",
        "content": "Jika terjadi masalah yang berkaitan dengan barang atau dokumen yang sudah di kirim sehingga karena satu dan lain hal barangnya hilang atau hilang dalam perjalanan, maka konsumen bisa meminta pertanggungjawaban manajemen Pakdome yang nanti akan di teruskan kepada vendor yang di tunjuk."
      },
      {
        "id": "9.2",
        "content": "Masalah besaran ganti rugi nanti akan di jelaskan oleh vendor masing masing sesuai dengan ketentuan yang sudah mereka berikan kepada manajemen Pakdome."
      }
    ]
  },
  {
    "id": "10",
    "title": "Tata Cara Klaim",
    "items": [
      {
        "id": "10.1",
        "content": "Klaim dari pihak pemilik barang atau dokumen dapat di ajukan ke manajemen Pakdome yang akan di terukan kepada vendor jasa pengiriman domestic sesuai dengan ketentuan yang bisa di peroleh dari penjelasan vendor jasa pengiriman domestic."
      },
      {
        "id": "10.2",
        "content": "Konsumen atau pemilik barang atau dokumen bisa mengajukan klaim dalam jangka waktu maksimal 14 hari setelah barang atau dokumen di jalankan. Dimana 14 hari itu adalah hari kalender nasional."
      }
    ]
  },
  {
    "id": "11",
    "title": "Hukum & Penyelesaian",
    "items": [
      {
        "id": "11.1",
        "content": "Jika terjadi masalah dan harus di selesaikan melalui jalur hukum, maka yang akan di proses adalah dengan melihat masalah apa yang menjadi kendala, tetapi juga sebelumnya akan di selesaikan dengan jalur damai atau kekeluargaan. Tetapi ketika secara damai tidak berhasil atau gagal, maka akan bisa di lanjutkan ke jalur hukum dimana kedua orang yang bersengketa bertempat tinggal."
      }
    ]
  },
  {
    "id": "12",
    "title": "Lain Lain",
    "items": [
      {
        "id": "12.1",
        "content": "Karena aplikasi Pakdome adalah masih menjadi kaitan bisnis dengan aplikasi Abang Express yang di miliki oleh PT Pasti Global Ekspresindo yang menjadi anggota dari ASPERINDO (Asosiasi Perusahaan Nasional Pengiriman dan Pengantaran Barang Indonesia), Agen Maskapai Penerbangan, sehingga semua hal termasuk SOP pengiriman barang atau dokumen akan tunduk pada ketentuan yang berlaku khusus Penyelenggara POS."
      }
    ]
  }


  
];
  
  export const contentList: ContentList[] = [
    { id: '1', title: 'Defisini', link: '#section-1' },
    { id: '2', title: 'Ketentuan Standar Pengiriman', link: '#section-2' },
    { id: '3', title: 'Tata Cara Pengiriman', link: '#section-3' },
    { id: '4', title: 'Pemeriksaan Kiriman', link: '#section-4' },
    { id: '5', title: 'Kiriman yang Dilarang', link: '#section-5' },
    { id: '6', title: 'Jaminan Kepemilikan Barang/ Dokumen', link: '#section-6' },
    { id: '7', title: 'Tarif Kepemilikan Barang/ Dokumen', link: '#section-7' },
    { id: '8', title: 'Asuransi', link: '#section-8' },
    { id: '9', title: 'Biaya Ganti Rugi', link: '#section-9' },
    { id: '10', title: 'Tata Cara Klaim', link: '#section-10' },
    { id: '11', title: 'Hukum & Penyelesaian', link: '#section-11' },
    { id: '12', title: 'Lain Lain', link: '#section-12' }
  ];