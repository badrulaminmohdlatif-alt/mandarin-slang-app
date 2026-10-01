// Senarai slang Melayu dan padanan Mandarin.
// Setiap item: my = slang Melayu, zh = aksara Cina, py = pinyin, note = maksud ringkas.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SLANG_DATA = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    {
      id: 'perasaan',
      title: 'Perasaan',
      icon: '😆',
      color: '#ff4b4b',
      items: [
        { my: 'Syok!', zh: '爽！', py: 'shuǎng', note: 'Seronok sangat / puas hati' },
        { my: 'Tak boleh blah', zh: '受不了', py: 'shòu bù liǎo', note: 'Tak tahan / melampau' },
        { my: 'Penat gila', zh: '累死了', py: 'lèi sǐ le', note: 'Sangat penat' },
        { my: 'Lapar gila', zh: '饿死了', py: 'è sǐ le', note: 'Sangat lapar' },
        { my: 'Pening kepala', zh: '头疼', py: 'tóuténg', note: 'Sakit kepala / buntu' },
        { my: 'Malas nak buat', zh: '懒得做', py: 'lǎn de zuò', note: 'Tiada semangat' },
        { my: 'Gelak guling-guling', zh: '笑死我了', py: 'xiào sǐ wǒ le', note: 'Kelakar sangat' },
        { my: 'Kacau la!', zh: '好烦！', py: 'hǎo fán', note: 'Menjengkelkan' }
      ]
    },
    {
      id: 'kawan',
      title: 'Kawan & Gosip',
      icon: '🧑‍🤝‍🧑',
      color: '#1cb0f6',
      items: [
        { my: 'Member', zh: '兄弟', py: 'xiōngdì', note: 'Kawan rapat (geng)' },
        { my: 'Awek', zh: '女朋友', py: 'nǚ péngyou', note: 'Teman wanita' },
        { my: 'Pakwe', zh: '男朋友', py: 'nán péngyou', note: 'Teman lelaki' },
        { my: 'Hensem', zh: '帅', py: 'shuài', note: 'Kacak' },
        { my: 'Kepoh', zh: '八卦', py: 'bāguà', note: 'Suka ambil tahu hal orang' },
        { my: 'Bodek', zh: '拍马屁', py: 'pāi mǎpì', note: 'Ampu / puji untuk kepentingan' },
        { my: 'Perasan', zh: '自恋', py: 'zìliàn', note: 'Rasa diri hebat' },
        { my: 'Kedekut', zh: '小气', py: 'xiǎoqi', note: 'Lokek' },
        { my: 'Ngam', zh: '合得来', py: 'hé de lái', note: 'Serasi / sekepala' }
      ]
    },
    {
      id: 'harian',
      title: 'Kehidupan Harian',
      icon: '🍜',
      color: '#ff9600',
      items: [
        { my: 'Tapau', zh: '打包', py: 'dǎbāo', note: 'Bungkus makanan bawa balik' },
        { my: 'Lepak', zh: '闲逛', py: 'xiánguàng', note: 'Bersantai / melepak' },
        { my: 'Sembang', zh: '聊天', py: 'liáotiān', note: 'Berbual' },
        { my: 'Ponteng', zh: '逃课', py: 'táokè', note: 'Tidak hadir kelas' },
        { my: 'Gostan', zh: '倒车', py: 'dàochē', note: 'Undur kereta' },
        { my: 'Sengkek', zh: '没钱', py: 'méi qián', note: 'Tiada duit / pokai' },
        { my: 'Tengah OTW', zh: '在路上', py: 'zài lùshang', note: 'Dalam perjalanan' },
        { my: 'Dah makan?', zh: '吃了吗？', py: 'chī le ma', note: 'Sapaan mesra' }
      ]
    },
    {
      id: 'ungkapan',
      title: 'Ungkapan Popular',
      icon: '💬',
      color: '#58cc02',
      items: [
        { my: 'Jom!', zh: '走吧！', py: 'zǒu ba', note: 'Mari pergi' },
        { my: 'Alamak!', zh: '哎呀！', py: 'āiyā', note: 'Aduhai! (terkejut)' },
        { my: 'Cincai', zh: '随便', py: 'suíbiàn', note: 'Ikut suka / tak kisah' },
        { my: 'Takpe', zh: '没关系', py: 'méi guānxi', note: 'Tak mengapa' },
        { my: 'Tak de hal', zh: '没问题', py: 'méi wèntí', note: 'Tiada masalah' },
        { my: 'Boleh tahan', zh: '还不错', py: 'hái búcuò', note: 'Bagus juga' },
        { my: 'Rilek la', zh: '放轻松', py: 'fàng qīngsōng', note: 'Bertenang' },
        { my: 'Gempak!', zh: '厉害！', py: 'lìhai', note: 'Hebat / power' },
        { my: 'Kantoi', zh: '被抓包', py: 'bèi zhuā bāo', note: 'Tertangkap' },
        { my: 'Bajet bagus', zh: '装', py: 'zhuāng', note: 'Berlagak / buat-buat' }
      ]
    }
  ];
});
