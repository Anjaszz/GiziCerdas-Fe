
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
  
 
  export const sections: Section[] = [
    {
      id: '1',
      title: 'Kebijakan Privasi Pelanggan',
      items: [
          {
              id: '1.1',
              content: 'Manajemen Pakdome akan menjaga semua data dan informasi yang diberikan  oleh klien atau pengguna aplikas pakdome. Namun dengan alasan tertentu dan memudahkan proses yang berhubungan dengan pengiriman dan cross cek barang, maka  pihak manajemen pakdome akan memberikan data atau informasi milik pelanggan/ klien kepada pihak ketiga dengan terlebih dahulu meminta ijin dari pelanggan/ klien  yang bersangkutan.'
            },
      ]
    },
    {
      id: '2',
      title: 'Layanan Pelanggan Aplikasi Pakdome',
      items: [
        {
          id: '2.1',
          content: 'Aplikasi Pakdome  : Ada tiga lokasi atau keberadaan aplikasi pakdome  yang bisa di gunakan oleh pelanggan/ klien yaitu : (1) Di kantor Pusat Abang Express (2) Di kantor Cabang atau Agen Abang Express (3) Mitra Aplikasi Pakdome seperti Komunitas UKM, Asosiasi/Perkumpulan dan lainnya.'
        },
        {
          id: '2.2',
          content: 'Situs Aplikasi Pakdome : Adalah sebuah situs atau aplikasi yang akan menjelaskan tentang aplikasi pakdome termasuk di dalamnya menyangkut berbagai fitur termasuk semua transaksi dan informasi yang di lakukan oleh pemilik akun serta benefit yang akan di dapatkan oleh siapapun yang memiliki akun di aplikasi pakdome.',
        },
        {
          id: '2.3',
          content: 'Benefit Aplikasi Pakdome : Aplikasi ini akan memberikan banyak keuntungan kepada pemilik akunnya seperti misalnya  (1) Dalam aplikasi ini akan menyediakan beragam jasa pengiriman domestic yang ada di Indonesia dengan pilihan  harga yang menarik (2) Dalam aplikasi ini pengguna akan mendapatkan fee atau keuntungan yang cukup menarik. Karena discount yang kami dapatkan dari vendor jasa pengiriman domestic akan di bagi sama 50% : 50% kepada pemilik akun aplikasi Pakdome.'
        },
      ]
    },
    {
      id: '3',
      title: 'Standar Operasional Pengiriman',
      items: [
        {
          id: '3.1',
          content: 'Transaksi menggunakan aplikasi Pakdome dianggap sah atau benar jika semua informasi yang di butuhkan telah  di masukan ke dalam  form yang telah di sediakan di aplikasi :',
          subItems: [
            'Nama lengkap pengirim dan Nama lengkap penerima',
            'Alamat lengkap pengirim dan Alamat lengkap penerima',
            'No. Telepon pengirim & penerima'
          ]
        },
        {
          id: '3.2',
          content: 'Semua hal yang terkait dengan informasi diatas dibutuhkan agar produk barang/ dokumen dalam di proses sesuai ketentuan dan di kirimkan sesuai dengan pilihan yang di pilih pengguna terhadap jasa pengiriman domestic yang ada di aplikasi pakdome.'
        },
        {
          id: '3.3',
          content: 'Semua data dan informasi  yang disampaikan oleh pemilik akun dan konsumen yang menggunakan aplikasi pakdome akan tersimpan dengan aman di manajemen pakdome. Akan di keluarkan ketika memang dibutuhkan atau di pergunakan untuk meningkatkan performance aplikasi pakdome di masa kini dan mendatang.'
        },
      ]
    },
    {
      id: "4",
      title: "Standar Pengamanan Aplikasi Pakdome",
      items: [
        {
          id: "4.1",
          content: "Siapapun dapat mengakses aplikasi pakdome dan masuk ke dalam sistem pakdome setelah sebelumnya memiliki akun pakdome yang di buatkan oleh team IT aplikasi pakdome."
          
        },
        {
          id: "4.2",
          content: "Akses yang di berikan oleh team IT aplikasi Pakdome bersifat personal dan rahasia. Sehingga segala hal  yang berkaitan isi dalam akun tersebut menjadi tanggungjawab pemilik akun yang bersangkutan. Karena semua data dan informasi yang ada di akun pemilik akun aplikasi pakdome juga bisa di lihat oleh team IT aplikasi Pakdome."
        },
        {
          id: "4.3",
          content: "Untuk menjamin keamanan dan pengamana  data dan informasi yang ada di aplikasi pakdome maka team IT aplikasi pakdome menerapkan beberapa sistem pengamanan"
        },
      ]
    },
    {
      id: "5",
      title: "Ketentuan Standar Pengiriman",
      items: [
        {
          id: "5.1",
          content: "Aplikasi pakdome menggunakan sistem pengamanan berlapis  yang memungkinkan orang lain yang tidak memiliki akses untuk tidak bisa masuk ke dashboard aplikasi pakdome.",
          subItems: [
            'Pemilik akun aplikasi pakdome memiliki User ID dan password, dimana password hanya diketahui oleh pemilik akun sendiri. Sedangkan pemilik akun aplikasi pakdome lain tidak bisa mengetahui password pemilik akun lainnya kecuali team IT aplikasi pakdome yang tahu semua User ID dan Pasword pemilik akun pakdome. Hal itu untuk mempermudah maintenance ketika ada masalah.',
            'Alamat e-mail selain sebagai proteksi juga digunakan oleh manajemen Aplikasi pakdome untuk  mengirimkan informasi transaksi Pelanggan serta informasi lain yang  berhubungan dengan kerjasama antara pemilik akun dengan manajemen aplikasi pakdome.',
            'Jika pemilik akun aplikasi pakdome ingi merubah alamat email yang biasa di pakai untuk korespondensi dengan manajemen pakdome, maka pemilik akun harus menginformasikan kepada manajemen aplikasi pakdome agar bisa di ubah keterangan datanya.'
          ]
        },
      ]
    },
    {
      id: "6",
      title: "Pengumpulan Data Pribadi Pelanggan/Pemilik Akun Aplikasi Pakdome",
      items: [
        {
          id: "6.1",
          content: "Manajemen aplikasi pakdome akan mengumpulkan data dan informasi  yang mencakup data dan informasi dari pengirim dan penerima barang/ dokumen untuk kemudahan dan kelancaran pengiriman barang/ dokumen sampai tujuan :",
          subItems: [
            'Pelanggan/ pemilik akun aplikasi pakdome  yang melakukan pengiriman paket dengan menggunakan aplikasi pakdome serta mengisi data pribadi (nama, alamat, nomor telpon lengkap pengirim dan nama, alamat, telpon lengkap penerima). Yang mana data pribadi yang dilampirkan digunakan agar proses pengiriman paket dapat dilakukan aman sampai di tujuan dan berguna  apabila ada tindak lanjut kebutuhan informasi dari transaksi yang terjadi.',
            'Pelanggan/ pemilik akun aplikasi pakdome yang mengisi data pribadi di pergunakan oleh manajemen aplikasi pakdome untuk kepentingan adminitrasi pendataan pemilik akun. Sehingga memudahkan ketika dari manajemen aplikasi pakdome ada informasi atau ada suatu hal yang mesti di informasikan atau di konfirmasi sesuai kebutuhan menjadi lebih mudah.'
          ]
        },
        
      ]
    },
    {
      id: "7",
      title: "Kebijakan Manajemen Aplikasi Pakdome",
      items: [
        {
          id: "7.1",
          content: "Demi keamanan dan kenyamanan bagi pengguna baik pemilik akun aplikasi pakdome ataupun konsumen yang menggunakan aplikasi tersebut. Maka kami dari manajemen aplikasi pakdome akan menginformasikan atau mensosialisasikan jika ada perubahan yang berhubungan dengan penggunaan aplikasi pakdome. Kami berharap para pemilik akun aplikasi pakdome juga bisa melihat di kebijakan privasi terkait adanya perubahan ketentuan  yang di lakukan oleh manajemen aplikasi pakdome."
        },
        
      ]
    },
    
  ];
    
    export const contentList: ContentList[] = [
      { id: '1', title: 'Kebijakan Privasi Pelanggan', link: '#section-1' },
      { id: '2', title: 'Layanan Pelanggan Aplikasi Pakdome', link: '#section-2' },
      { id: '3', title: 'Standar Operasional Pengiriman', link: '#section-3' },
      { id: '4', title: 'Standar Pengamanan Aplikasi Pakdome', link: '#section-4' },
      { id: '5', title: 'Ketentuan Standar Pengiriman', link: '#section-5' },
      { id: '6', title: 'Pengumpulan Data Pribadi Pelanggan/Pemilik Akun  Aplikasi Pakdome', link: '#section-6' },
      { id: '7', title: 'Kebijakan Manajemen Aplikasi Pakdome', link: '#section-7' },
    ];