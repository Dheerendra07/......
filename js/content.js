/**
 * ============================================================================
 * PERSONALIZATION & CONTENT CONFIGURATION
 * ============================================================================
 * Yahan se aap poori website ka naam, message, photos, letter aur music
 * aasani se badal sakte hain.
 *
 * Tip: Bina code edit kiye bhi aap URL me naam bhej sakte hain:
 *      ?name=Anjali&from=Rahul
 * ============================================================================
 */

import { PHOTO_DATA } from './photo-data.js';

export const SITE_CONFIG = {
  // Unka naam (khali chhodne par "Mera Sukoon" / "मेरा सुकून" dikhega)
  recipientName: {
    hinglish: 'Mera Sukoon',
    hindi: 'मेरा सुकून',
  },

  // Aapka naam — letter ke sign-off me dikhega
  senderName: {
    hinglish: 'Hamesha Tumhara',
    hindi: 'हमेशा तुम्हारा',
  },

  // Song configuration: "Vaaroon" from Mirzapur (Original — Anand Bhaskar & Romy)
  // Agar aap apna local MP3 lagana chahein to `src` me './assets/music/varoon.mp3' dein.
  // Warna official YouTube audio embed sirf user ke tap karne par chalega (no autoplay).
  music: {
    src: '',
    youtubeId: 's_WCm5PMzmk',
    fallbackYoutubeId: 'OZTXQEuk9QI',
    volume: 0.45,
    title: {
      hinglish: 'Vaaroon · Mirzapur',
      hindi: 'वारूँ · मिर्ज़ापुर',
    },
    artist: {
      hinglish: 'Anand Bhaskar · Romy',
      hindi: 'आनंद भास्कर · रोमी',
    },
  },

  // Letter-open synced song: "Tum Se Hi" (Jab We Met — Mohit Chauhan, T-Series Official)
  // Khat khulte hi exact chorus timestamp (0:47) par sync hota hai!
  letterSong: {
    src: '',
    youtubeId: 'Cb6wuzOurPc',
    startSeconds: 47,
    title: {
      hinglish: 'Tum Se Hi · Jab We Met',
      hindi: 'तुम से ही · जब वी मेट',
    },
    artist: {
      hinglish: 'Mohit Chauhan · Irshad Kamil',
      hindi: 'मोहित चौहान · इरशाद कामिल',
    },
    cues: [
      {
        atMs: 0,
        hinglish: '“Tum se hi din hota hai, surmayi shaam aati hai…”',
        hindi: '“तुम से ही दिन होता है, सुरमई शाम आती है…”',
      },
      {
        atMs: 6500,
        hinglish: '“Har ghadi saans aati hai, zindagi kehlati hai…”',
        hindi: '“हर घड़ी साँस आती है, ज़िंदगी कहलाती है…”',
      },
      {
        atMs: 13500,
        hinglish: '“Tum se hi, tum se hi…”',
        hindi: '“तुम से ही, तुम से ही…”',
      },
    ],
  },

  // Default language script: 'hinglish' ya 'hindi'
  defaultScript: 'hinglish',
};

/**
 * Sabhi 6 real photographs — original portrait proportions ke saath.
 * Koi bhi fictional memory ya jhoothi kahani nahi jodi gayi hai.
 */
export const GALLERY_PHOTOS = [
  {
    id: 'photo-festive',
    src: PHOTO_DATA['photo-festive'],
    fileSrc: './assets/images/photo-1.jpg',
    customSrc: '',
    width: 900,
    height: 1599,
    layout: 'lead',
    focusPosition: '50% 18%',
    alt: {
      hinglish: 'Traditional suit aur dupatte me unki ek khoobsurat tasveer',
      hindi: 'पारंपरिक सूट और दुपट्टे में उनकी एक ख़ूबसूरत तस्वीर',
    },
    caption: {
      hinglish: 'Jab saadgi aur tehzeeb ek saath muskurati hain.',
      hindi: 'जब सादगी और नज़ाकत एक साथ मुस्कुराती हैं।',
    },
    note: {
      hinglish: '01 · Khamosh Khoobsurti',
      hindi: '०१ · ख़ामोश ख़ूबसूरती',
    },
  },
  {
    id: 'photo-sweater',
    src: PHOTO_DATA['photo-sweater'],
    fileSrc: './assets/images/photo-2.jpg',
    customSrc: '',
    width: 720,
    height: 1280,
    layout: 'pair',
    focusPosition: '50% 20%',
    alt: {
      hinglish: 'Halki muskaan aur chhoti si bindi ke saath unki tasveer',
      hindi: 'हल्की मुस्कान और छोटी-सी बिंदी के साथ उनकी तस्वीर',
    },
    caption: {
      hinglish: 'Ek halki si muskaan, aur poora din behtar lagne lagta hai.',
      hindi: 'एक हल्की-सी मुस्कान, और पूरा दिन बेहतर लगने लगता है।',
    },
    note: {
      hinglish: '02 · Wahi Narmi',
      hindi: '०२ · वही नर्मी',
    },
  },
  {
    id: 'photo-monochrome',
    src: PHOTO_DATA['photo-monochrome'],
    fileSrc: './assets/images/photo-3.jpg',
    customSrc: '',
    width: 540,
    height: 960,
    layout: 'pair',
    focusPosition: '50% 25%',
    alt: {
      hinglish: 'Black and white andaaz me unka ek pyaara candid pal',
      hindi: 'ब्लैक एंड व्हाइट अंदाज़ में उनका एक प्यारा सा पल',
    },
    caption: {
      hinglish: 'Kuch tasveerein bina rangon ke bhi sabse zyada apni lagti hain.',
      hindi: 'कुछ तस्वीरें बिना रंगों के भी सबसे ज़्यादा अपनी लगती हैं।',
    },
    note: {
      hinglish: '03 · Thehra Hua Pal',
      hindi: '०३ · ठहरा हुआ पल',
    },
  },
  {
    id: 'photo-pink',
    src: PHOTO_DATA['photo-pink'],
    fileSrc: './assets/images/photo-4.jpg',
    customSrc: '',
    width: 720,
    height: 1280,
    layout: 'feature',
    focusPosition: '50% 22%',
    alt: {
      hinglish: 'Halka muskurate hue unka close-up portrait',
      hindi: 'हल्के से मुस्कुराते हुए उनकी नज़दीकी तस्वीर',
    },
    caption: {
      hinglish: 'Aankhon ki sachchai aur chehre ka sukoon — dono ek saath.',
      hindi: 'आँखों की सच्चाई और चेहरे का सुकून — दोनों एक साथ।',
    },
    note: {
      hinglish: '04 · Bina Dikhawa',
      hindi: '०४ · बिना दिखावा',
    },
  },
  {
    id: 'photo-rooftop',
    src: PHOTO_DATA['photo-rooftop'],
    fileSrc: './assets/images/photo-5.jpg',
    customSrc: '',
    width: 660,
    height: 1305,
    layout: 'pair',
    focusPosition: '50% 20%',
    alt: {
      hinglish: 'Khule aasman ke neeche unki ek natural tasveer',
      hindi: 'खुले आसमान के नीचे उनकी एक स्वाभाविक तस्वीर',
    },
    caption: {
      hinglish: 'Har aam si shaam tumhare hone se khaas ban jaati hai.',
      hindi: 'हर आम-सी शाम तुम्हारे होने से ख़ास बन जाती है।',
    },
    note: {
      hinglish: '05 · Apna Sa Andaaz',
      hindi: '०५ · अपना-सा अंदाज़',
    },
  },
  {
    id: 'photo-bluedoor',
    src: PHOTO_DATA['photo-bluedoor'],
    fileSrc: './assets/images/photo-6.jpg',
    customSrc: '',
    width: 660,
    height: 1305,
    layout: 'pair',
    focusPosition: '50% 22%',
    alt: {
      hinglish: 'Neele darwaze ke saamne unki shaant muskaan wali tasveer',
      hindi: 'नीले दरवाज़े के सामने उनकी शांत मुस्कान वाली तस्वीर',
    },
    caption: {
      hinglish: 'Tum jaisi ho, waisi hi sabse khoobsurat ho.',
      hindi: 'तुम जैसी हो, वैसी ही सबसे ख़ूबसूरत हो।',
    },
    note: {
      hinglish: '06 · Bas Tum',
      hindi: '०६ · बस तुम',
    },
  },
];

/**
 * Dual-script editorial copy:
 * - hinglish: Easy-to-read Roman Hindi with dignified Hindi editorial accents
 * - hindi: Pure, natural, heartfelt Devanagari Hindi
 */
export const COPY = {
  hinglish: {
    pageTitle: 'Janamdin Mubarak — Sirf Tumhare Liye',
    brandMark: 'Sirf Tumhare Liye',
    nav: {
      message: 'Sandesh',
      memories: 'Tasveerein',
      qualities: 'Khubiyan',
      letter: 'Khat',
    },
    audio: {
      play: 'Vaaroon Suno',
      pause: 'Gaana Roko',
      ariaPlay: 'Mirzapur ka Vaaroon gaana chalayein',
      ariaPause: 'Vaaroon gaana band karein',
      minimize: 'Chhota karein',
      expand: 'Player dikhayein',
      close: 'Gaana band karein',
      hint: 'Agar awaaz na aaye to neeche play button par tap karein.',
      nowPlaying: 'Chal raha hai',
    },
    scriptToggleLabel: 'Padhne ka andaaz chunein',
    intro: {
      kicker: 'Ek Khaas Din · Sirf Tumhare Naam',
      greeting: 'Janamdin Mubarak',
      lead: 'Kuch log zindagi me aakar bina shor machaye sab kuch khoobsurat bana dete hain. Aaj ka yeh chhota sa tohfa sirf tumhare liye hai.',
      cta: 'Shuru Karein',
      portraitCaption: 'Wahi narmi, wahi apnapan',
    },
    message: {
      chapter: '01 · Dil Se Ek Baat',
      heading: 'Tumhara hona hi sabse bada sukoon hai',
      paragraphs: [
        'Aaj tumhara janamdin hai, aur sach kahun to samajh nahi aata ki shabdon me kaise bataun tum mere liye kitni zaroori ho. Kuch rishte dikhawe ke nahi hote — wo bas chupchaap zindagi ko behtar bana dete hain.',
        'Tumhare saath hone ka sabse accha ehsaas yeh hai ki sab kuch aasan aur shaant lagne lagta hai. Jab din thaka dene wala hota hai, tab tumhari ek baat ya tumhari halki si muskaan poora mann halka kar deti hai.',
        'Main bas itna chahta hoon ki jitni khushi aur apnapan tum bina jataye sabko deti ho, zindagi tumhe usse kahin zyada lauta kar de. Tum sach me bahut khaas ho.',
      ],
      signatureLine: 'Dil se shukriya — meri zindagi me hone ke liye.',
    },
    gallery: {
      chapter: '02 · Kuch Pyaare Pal',
      heading: 'Har tasveer me wahi sachchai',
      subtitle: 'Kisi bhi tasveer par tap karke use poori screen par dekhein.',
      openLabel: 'Poori screen par dekhein',
      closeLabel: 'Band karein',
      prevLabel: 'Pichhli tasveer',
      nextLabel: 'Agli tasveer',
      swipeHint: 'Aage-peeche dekhne ke liye swipe karein',
      fallbackTitle: 'Tasveer load nahi ho saki',
    },
    qualities: {
      chapter: '03 · Tumhari Khubiyan',
      heading: 'Wo baatein jo tumhe sabse alag banati hain',
      intro: 'Taarif ke liye bade shabdon ki zaroorat nahi hoti — bas sachchai kaafi hoti hai.',
      items: [
        {
          number: '01',
          title: 'Tumhari Saadgi',
          body: 'Aaj ke waqt me jab har koi kuch aur banne ki koshish karta hai, tum jaisi ho waisi hi rehti ho. Tumhari yehi asliyat sabse khoobsurat hai.',
        },
        {
          number: '02',
          title: 'Tumhari Muskaan Ka Asar',
          body: 'Tum jab dil se muskurati ho, to aas-paas ka poora mahaul badal jaata hai. Us ek pal me saari fikr chhoti lagne lagti hai.',
        },
        {
          number: '03',
          title: 'Chhoti Baaton Ki Fikr',
          body: 'Bina dikhaye, bina bole, jis tarah tum apno ka khayal rakhti ho — wo narmi aur samajh bahut kam logon me milti hai.',
        },
        {
          number: '04',
          title: 'Tumhara Saaf Dil',
          body: 'Tumhare saath baat karte waqt kabhi sochna nahi padta ki kya bolna hai. Tumhari maujoodgi me ek ajeeb sa bharosa aur apnapan hai.',
        },
        {
          number: '05',
          title: 'Tumhara Saath',
          body: 'Zaroori nahi ki har waqt dher saari baatein hon — kabhi-kabhi bas yeh jaanna ki tum saath ho, wahi kaafi hota hai.',
        },
      ],
    },
    letter: {
      chapter: '04 · Ek Khat',
      heading: 'Kuch baatein jo dil me thi',
      subtitle: 'Yeh khat sirf tumhare padhne ke liye hai. Aaram se kholo.',
      envelopeLabel: 'Sirf Tumhare Naam',
      envelopeSub: 'Janamdin par dil se likha hua',
      openButton: 'Khat Kholein',
      closeButton: 'Lifafa Band Karein',
      salutationPrefix: 'Meri pyaari',
      dateLabel: 'Tumhare Janamdin Par',
      paragraphs: [
        'Aaj ke din main tumhe koi badi-badi baatein ya filmon wale vaade nahi kehna chahta. Bas wahi sach likh raha hoon jo main har roz mehsoos karta hoon.',
        'Jab se tum zindagi me aayi ho, cheezein zyada shaant, zyada khoobsurat aur zyada apni lagne lagi hain. Tumhari muskaan, tumhari chhoti-chhoti baatein aur tumhara khayal rakhne ka andaaz — yeh sab mere liye bahut maayne rakhta hai.',
        'Mujhe pata hai zindagi me hamesha sab aasan nahi hota, par itna yakeen rakhna ki har acche aur mushkil waqt me meri koshish hamesha yahi rahegi ki tum khud ko kabhi akela na mehsoos karo. Tumhari izzat, tumhari khushi aur tumhara sukoon mere liye hamesha sabse upar rahega.',
        'Aaj tumhara din hai. Khul kar muskurana, apna khayal rakhna, aur hamesha yaad rakhna ki koi hai jo tumhari qadr dil se karta hai.',
      ],
      closing: 'Janamdin ki dher saari shubhkamnayein,',
      songKicker: 'Khat ke saath ek dhun',
      songPlay: 'Phir Suno',
      songStop: 'Roko',
      songHint: 'Agar phone par awaaz na aaye to neeche play par ek tap karein.',
    },
    wish: {
      chapter: '05 · Aakhiri Dua',
      heading: 'Janamdin Mubarak',
      body: 'Dua hai ki aane wala har saal tumhari zindagi me acchi sehat, sukoon, aur wo saari khushiyan lekar aaye jinki tum haqdaar ho.',
      footerNote: 'Dil se banaya gaya · Sirf tumhare liye',
    },
  },

  hindi: {
    pageTitle: 'जन्मदिन मुबारक — सिर्फ़ तुम्हारे लिए',
    brandMark: 'सिर्फ़ तुम्हारे लिए',
    nav: {
      message: 'संदेश',
      memories: 'तस्वीरें',
      qualities: 'ख़ूबियाँ',
      letter: 'ख़त',
    },
    audio: {
      play: 'वारूँ सुनें',
      pause: 'गाना रोकें',
      ariaPlay: 'मिर्ज़ापुर का वारूँ गाना चलाएँ',
      ariaPause: 'वारूँ गाना बंद करें',
      minimize: 'छोटा करें',
      expand: 'प्लेयर दिखाएँ',
      close: 'गाना बंद करें',
      hint: 'अगर आवाज़ न आए तो नीचे प्ले बटन पर टैप करें।',
      nowPlaying: 'चल रहा है',
    },
    scriptToggleLabel: 'पढ़ने का अंदाज़ चुनें',
    intro: {
      kicker: 'एक ख़ास दिन · सिर्फ़ तुम्हारे नाम',
      greeting: 'जन्मदिन मुबारक',
      lead: 'कुछ लोग ज़िंदगी में आकर बिना शोर मचाए सब कुछ ख़ूबसूरत बना देते हैं। आज का यह छोटा-सा तोहफ़ा सिर्फ़ तुम्हारे लिए है।',
      cta: 'शुरू करें',
      portraitCaption: 'वही नर्मी, वही अपनापन',
    },
    message: {
      chapter: '०१ · दिल से एक बात',
      heading: 'तुम्हारा होना ही सबसे बड़ा सुकून है',
      paragraphs: [
        'आज तुम्हारा जन्मदिन है, और सच कहूँ तो समझ नहीं आता कि शब्दों में कैसे बताऊँ तुम मेरे लिए कितनी ज़रूरी हो। कुछ रिश्ते दिखावे के नहीं होते — वे बस चुपचाप ज़िंदगी को बेहतर बना देते हैं।',
        'तुम्हारे साथ होने का सबसे अच्छा एहसास यह है कि सब कुछ आसान और शांत लगने लगता है। जब दिन थका देने वाला होता है, तब तुम्हारी एक बात या तुम्हारी हल्की-सी मुस्कान पूरा मन हल्का कर देती है।',
        'मैं बस इतना चाहता हूँ कि जितनी ख़ुशी और अपनापन तुम बिना जताए सबको देती हो, ज़िंदगी तुम्हें उससे कहीं ज़्यादा लौटा कर दे। तुम सच में बहुत ख़ास हो।',
      ],
      signatureLine: 'दिल से शुक्रिया — मेरी ज़िंदगी में होने के लिए।',
    },
    gallery: {
      chapter: '०२ · कुछ प्यारे पल',
      heading: 'हर तस्वीर में वही सच्चाई',
      subtitle: 'किसी भी तस्वीर पर टैप करके उसे पूरी स्क्रीन पर देखें।',
      openLabel: 'पूरी स्क्रीन पर देखें',
      closeLabel: 'बंद करें',
      prevLabel: 'पिछली तस्वीर',
      nextLabel: 'अगली तस्वीर',
      swipeHint: 'आगे-पीछे देखने के लिए स्वाइप करें',
      fallbackTitle: 'तस्वीर लोड नहीं हो सकी',
    },
    qualities: {
      chapter: '०३ · तुम्हारी ख़ूबियाँ',
      heading: 'वे बातें जो तुम्हें सबसे अलग बनाती हैं',
      intro: 'तारीफ़ के लिए बड़े शब्दों की ज़रूरत नहीं होती — बस सच्चाई काफ़ी होती है।',
      items: [
        {
          number: '०१',
          title: 'तुम्हारी सादगी',
          body: 'आज के वक़्त में जब हर कोई कुछ और बनने की कोशिश करता है, तुम जैसी हो वैसी ही रहती हो। तुम्हारी यही असलियत सबसे ख़ूबसूरत है।',
        },
        {
          number: '०२',
          title: 'तुम्हारी मुस्कान का असर',
          body: 'तुम जब दिल से मुस्कुराती हो, तो आस-पास का पूरा माहौल बदल जाता है। उस एक पल में सारी फ़िक्र छोटी लगने लगती है।',
        },
        {
          number: '०३',
          title: 'छोटी बातों की फ़िक्र',
          body: 'बिना दिखाए, बिना बोले, जिस तरह तुम अपनों का ख़याल रखती हो — वह नर्मी और समझ बहुत कम लोगों में मिलती है।',
        },
        {
          number: '०४',
          title: 'तुम्हारा साफ़ दिल',
          body: 'तुम्हारे साथ बात करते वक़्त कभी सोचना नहीं पड़ता कि क्या बोलना है। तुम्हारी मौजूदगी में एक अजीब-सा भरोसा और अपनापन है।',
        },
        {
          number: '०५',
          title: 'तुम्हारा साथ',
          body: 'ज़रूरी नहीं कि हर वक़्त ढेर सारी बातें हों — कभी-कभी बस यह जानना कि तुम साथ हो, वही काफ़ी होता है।',
        },
      ],
    },
    letter: {
      chapter: '०४ · एक ख़त',
      heading: 'कुछ बातें जो दिल में थीं',
      subtitle: 'यह ख़त सिर्फ़ तुम्हारे पढ़ने के लिए है। आराम से खोलो।',
      envelopeLabel: 'सिर्फ़ तुम्हारे नाम',
      envelopeSub: 'जन्मदिन पर दिल से लिखा हुआ',
      openButton: 'ख़त खोलें',
      closeButton: 'लिफ़ाफ़ा बंद करें',
      salutationPrefix: 'मेरी प्यारी',
      dateLabel: 'तुम्हारे जन्मदिन पर',
      paragraphs: [
        'आज के दिन मैं तुम्हें कोई बड़ी-बड़ी बातें या फ़िल्मों वाले वादे नहीं कहना चाहता। बस वही सच लिख रहा हूँ जो मैं हर रोज़ महसूस करता हूँ।',
        'जब से तुम ज़िंदगी में आई हो, चीज़ें ज़्यादा शांत, ज़्यादा ख़ूबसूरत और ज़्यादा अपनी लगने लगी हैं। तुम्हारी मुस्कान, तुम्हारी छोटी-छोटी बातें और तुम्हारा ख़याल रखने का अंदाज़ — यह सब मेरे लिए बहुत मायने रखता है।',
        'मुझे पता है ज़िंदगी में हमेशा सब आसान नहीं होता, पर इतना यक़ीन रखना कि हर अच्छे और मुश्किल वक़्त में मेरी कोशिश हमेशा यही रहेगी कि तुम ख़ुद को कभी अकेला न महसूस करो। तुम्हारी इज़्ज़त, तुम्हारी ख़ुशी और तुम्हारा सुकून मेरे लिए हमेशा सबसे ऊपर रहेगा।',
        'आज तुम्हारा दिन है। खुल कर मुस्कुराना, अपना ख़याल रखना, और हमेशा याद रखना कि कोई है जो तुम्हारी क़द्र दिल से करता है।',
      ],
      closing: 'जन्मदिन की ढेर सारी शुभकामनाएँ,',
      songKicker: 'ख़त के साथ एक धुन',
      songPlay: 'फिर सुनें',
      songStop: 'रोकें',
      songHint: 'अगर फ़ोन पर आवाज़ न आए तो नीचे प्ले पर एक टैप करें।',
    },
    wish: {
      chapter: '०५ · आख़िरी दुआ',
      heading: 'जन्मदिन मुबारक',
      body: 'दुआ है कि आने वाला हर साल तुम्हारी ज़िंदगी में अच्छी सेहत, सुकून, और वे सारी ख़ुशियाँ लेकर आए जिनकी तुम हक़दार हो।',
      footerNote: 'दिल से बनाया गया · सिर्फ़ तुम्हारे लिए',
    },
  },
};
