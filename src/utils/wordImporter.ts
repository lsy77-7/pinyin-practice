import { pinyin } from "pinyin-pro";
import { WordItem } from "../data/words";
import {
  PRIMARY_SCHOOL_WORDS,
  buildWordTrie,
  isInWordDict,
} from "./primarySchoolDict";

export interface ImportResult {
  words: WordItem[];
  totalFound: number;
  uniqueCount: number;
  skippedShort: number;
  skippedLong: number;
}

function isChineseChar(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code >= 0x4e00 && code <= 0x9fff;
}

const PINYIN_CORRECTION: Record<string, string> = {
  "刻舟求剑": "kè zhōu qiú jiàn",
  "满腔热忱": "mǎn qiāng rè chén",
  "热忱": "rè chén",
  "热情": "rè qíng",
  "感激": "gǎn jī",
  "感动": "gǎn dòng",
  "助人为乐": "zhù rén wéi lè",
  "无微不至": "wú wēi bù zhì",
  "体贴入微": "tǐ tiē rù wēi",
  "舍己为人": "shě jǐ wèi rén",
  "救死扶伤": "jiù sǐ fú shāng",
  "见义勇为": "jiàn yì yǒng wéi",
  "拾金不昧": "shí jīn bù mèi",
  "尊老爱幼": "zūn lǎo ài yòu",
  "吃苦耐劳": "chī kǔ nài láo",
  "坚忍不拔": "jiān rěn bù bá",
  "锲而不舍": "qiè ér bù shě",
  "持之以恒": "chí zhī yǐ héng",
  "坚持不懈": "jiān chí bù xiè",
  "实事求是": "shí shì qiú shì",
  "求真务实": "qiú zhēn wù shí",
  "兢兢业业": "jīng jīng yè yè",
  "勤勤恳恳": "qín qín kěn kěn",
  "任劳任怨": "rèn láo rèn yuàn",
  "亡羊补牢": "wáng yáng bǔ láo",
  "守株待兔": "shǒu zhū dài tù",
  "掩耳盗铃": "yǎn ěr dào líng",
  "滥竽充数": "làn yú chōng shù",
  "画蛇添足": "huà shé tiān zú",
  "自相矛盾": "zì xiāng máo dùn",
  "拔苗助长": "bá miáo zhù zhǎng",
  "愚公移山": "yú gōng yí shān",
  "杯弓蛇影": "bēi gōng shé yǐng",
  "井底之蛙": "jǐng dǐ zhī wā",
  "狐假虎威": "hú jiǎ hǔ wēi",
  "叶公好龙": "yè gōng hào lóng",
  "卧薪尝胆": "wò xīn cháng dǎn",
  "破釜沉舟": "pò fǔ chén zhōu",
  "负荆请罪": "fù jīng qǐng zuì",
  "完璧归赵": "wán bì guī zhào",
  "毛遂自荐": "máo suì zì jiàn",
  "退避三舍": "tuì bì sān shè",
  "望梅止渴": "wàng méi zhǐ kě",
  "指鹿为马": "zhǐ lù wéi mǎ",
  "对牛弹琴": "duì niú tán qín",
  "纸上谈兵": "zhǐ shàng tán bīng",
  "胸有成竹": "xiōng yǒu chéng zhú",
  "手不释卷": "shǒu bù shì juàn",
  "鹏程万里": "péng chéng wàn lǐ",
  "入木三分": "rù mù sān fēn",
  "洛阳纸贵": "luò yáng zhǐ guì",
  "草木皆兵": "cǎo mù jiē bīng",
  "按图索骥": "àn tú suǒ jì",
  "后来居上": "hòu lái jū shàng",
  "请君入瓮": "qǐng jūn rù wèng",
  "高山流水": "gāo shān liú shuǐ",
  "唇亡齿寒": "chún wáng chǐ hán",
  "闻鸡起舞": "wén jī qǐ wǔ",
  "专心致志": "zhuān xīn zhì zhì",
  "废寝忘食": "fèi qǐn wàng shí",
  "夜以继日": "yè yǐ jì rì",
  "通宵达旦": "tōng xiāo dá dàn",
  "聚精会神": "jù jīng huì shén",
  "全神贯注": "quán shén guàn zhù",
  "一丝不苟": "yī sī bù gǒu",
  "精益求精": "jīng yì qiú jīng",
  "脚踏实地": "jiǎo tà shí dì",
  "不耻下问": "bù chǐ xià wèn",
  "春华秋实": "chūn huá qiū shí",
  "果实累累": "guǒ shí léi léi",
  "凤毛麟角": "fèng máo lín jiǎo",
  "盛气凌人": "shèng qì líng rén",
  "兴高采烈": "xìng gāo cǎi liè",
  "兴致勃勃": "xìng zhì bó bó",
  "中华人民共和国": "zhōng huá rén mín gòng hé guó",
  "学校": "xué xiào",
  "同学": "tóng xué",
  "读书": "dú shū",
  "写字": "xiě zì",
  "认真": "rèn zhēn",
  "孩子": "hái zi",
  "人们": "rén men",
  "今天": "jīn tiān",
  "明白": "míng bai",
  "什么": "shén me",
  "怎么": "zěn me",
  "高兴": "gāo xìng",
  "喜欢": "xǐ huan",
  "微笑": "wēi xiào",
  "重量": "zhòng liàng",
  "重复": "chóng fù",
  "重点": "zhòng diǎn",
  "重新": "chóng xīn",
  "困难": "kùn nan",
  "歌曲": "gē qǔ",
  "弯曲": "wān qū",
  "快乐": "kuài lè",
  "音乐": "yīn yuè",
  "还书": "huán shū",
  "还要": "hái yào",
  "看书": "kàn shū",
  "看门": "kān mén",
  "背着": "bēi zhe",
  "背心": "bèi xīn",
  "假的": "jiǎ de",
  "放假": "fàng jià",
  "朝阳": "zhāo yáng",
  "朝向": "cháo xiàng",
  "躲藏": "duǒ cáng",
  "宝藏": "bǎo zàng",
  "沉着": "chén zhuó",
  "着数": "zhāo shù",
  "睡觉": "shuì jiào",
  "觉得": "jué de",
  "银行": "yín háng",
  "行走": "xíng zǒu",
  "好事": "hǎo shì",
  "爱好": "ài hào",
  "长处": "cháng chù",
  "生长": "shēng zhǎng",
  "种子": "zhǒng zi",
  "种菜": "zhòng cài",
  "天空": "tiān kōng",
  "有空": "yǒu kòng",
  "干活": "gàn huó",
  "干净": "gān jìng",
  "分别": "fēn bié",
  "养分": "yǎng fèn",
  "曾经": "céng jīng",
  "曾子": "zēng zǐ",
  "相处": "xiāng chǔ",
  "照相": "zhào xiàng",
  "难过": "nán guò",
  "灾难": "zāi nàn",
  "还有": "hái yǒu",
  "还书": "huán shū",
  "漂浮": "piāo fú",
  "漂亮": "piào liang",
  "冲茶": "chōng chá",
  "冲着": "chòng zhe",
  "茄子": "qié zi",
  "萝卜": "luó bo",
  "伯伯": "bó bo",
  "爷爷": "yé ye",
  "奶奶": "nǎi nai",
  "爸爸": "bà ba",
  "妈妈": "mā ma",
  "哥哥": "gē ge",
  "姐姐": "jiě jie",
  "弟弟": "dì di",
  "妹妹": "mèi mei",
  "认真": "rèn zhēn",
  "中国": "zhōng guó",
  "北京": "běi jīng",
  "上海": "shàng hǎi",
  "西湖": "xī hú",
  "长城": "cháng chéng",
  "故宫": "gù gōng",
  "长江": "cháng jiāng",
  "黄河": "huáng hé",
  "黄山": "huáng shān",
  "泰山": "tài shān",
  "华山": "huà shān",
  "庐山": "lú shān",
};

export function wordToPinyin(word: string): string {
  if (PINYIN_CORRECTION[word]) return PINYIN_CORRECTION[word];
  return pinyin(word, {
    toneType: "symbol",
    type: "string",
    nonZh: "consecutive",
    mode: "word",
    v: false,
  });
}

const HIGH_FREQUENT_CHARS = [
  "的", "了", "是", "我", "你", "他", "她", "它", "在", "有", "和", "就",
  "不", "人", "都", "一", "一个", "上", "也", "很", "到", "说", "要", "去",
  "你", "会", "着", "没有", "看", "好", "自己", "这", "那", "里", "来",
  "把", "被", "让", "给", "向", "从", "以", "及", "与", "或", "但",
  "而", "如", "若", "虽", "因", "为", "所", "以", "之", "于", "其",
];

const COMMON_SECOND_CHARS_HIGH = new Set([
  "的", "地", "得", "了", "着", "过", "们", "子", "里", "面", "头", "下",
  "上", "中", "出", "来", "去", "起", "开", "到", "见", "听", "说",
]);

const COMMON_PREFIX_HIGH = new Set([
  "我", "你", "他", "她", "它", "这", "那", "哪", "什", "怎", "各", "每",
  "某", "本", "该", "此", "彼",
]);

function isLikelyMeaningfulWord(word: string): boolean {
  if (word.length === 2) {
    const [c1, c2] = [word[0], word[1]];
    if (HIGH_FREQUENT_CHARS.includes(c1) && HIGH_FREQUENT_CHARS.includes(c2)) {
      return false;
    }
    if (COMMON_PREFIX_HIGH.has(c1) && HIGH_FREQUENT_CHARS.includes(c2)) {
      return false;
    }
    if (HIGH_FREQUENT_CHARS.includes(c1) && COMMON_SECOND_CHARS_HIGH.has(c2)) {
      return false;
    }
    if (
      (c1 === "从" && (c2 === "土" || c2 === "头" || c2 === "小" || c2 === "草")) ||
      (c1 === "草" && (c2 === "从" || c2 === "里")) ||
      (c1 === "土" && (c2 === "里" || c2 === "头" || c2 === "从")) ||
      (c1 === "小" && (c2 === "从" || c2 === "里")) ||
      (c1 === "脸" && (c2 === "上" || c2 === "里")) ||
      (c1 === "头" && (c2 === "上" || c2 === "出")) ||
      (c1 === "探" && (c2 === "出" || c2 === "头"))
    ) {
      return false;
    }
  }
  if (word.length === 3) {
    for (const hf of HIGH_FREQUENT_CHARS) {
      if (word.startsWith(hf) || word.endsWith(hf)) {
      }
    }
    if (/[的地得着了过们子]$/.test(word)) {
      return false;
    }
  }
  return true;
}

export function extractChineseWords(text: string): string[] {
  const cleanText = text.replace(/[\r\n\t]+/g, " ");
  const segments: string[] = [];
  let current = "";

  for (const ch of cleanText) {
    if (isChineseChar(ch)) {
      current += ch;
    } else {
      if (current.length >= 2) {
        segments.push(current);
      }
      current = "";
    }
  }
  if (current.length >= 2) {
    segments.push(current);
  }

  const dict = buildWordTrie();
  const rawWords: string[] = [];

  for (const seg of segments) {
    if (seg.length <= 4) {
      if (isInWordDict(seg, dict)) {
        rawWords.push(seg);
      } else if (isLikelyMeaningfulWord(seg)) {
        rawWords.push(seg);
      }
      continue;
    }

    const used = new Array<boolean>(seg.length).fill(false);
    for (let len = 4; len >= 2; len--) {
      for (let i = 0; i + len <= seg.length; i++) {
        const slice = seg.slice(i, i + len);
        if (isInWordDict(slice, dict)) {
          let overlap = false;
          for (let k = i; k < i + len; k++) {
            if (used[k]) {
              overlap = true;
              break;
            }
          }
          if (!overlap) {
            rawWords.push(slice);
            for (let k = i; k < i + len; k++) {
              used[k] = true;
            }
          }
        }
      }
    }

    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i + len <= seg.length; i++) {
        const slice = seg.slice(i, i + len);
        if (isInWordDict(slice, dict)) continue;
        let overlap = false;
        for (let k = i; k < i + len; k++) {
          if (used[k]) {
            overlap = true;
            break;
          }
        }
        if (overlap) continue;
        if (!isLikelyMeaningfulWord(slice)) continue;

        const inPrimary = PRIMARY_SCHOOL_WORDS.some((w) => w.includes(slice));
        if (!inPrimary && len === 2) {
          const [c1, c2] = [slice[0], slice[1]];
          if (/[的地得着了过们子你我他她它这那是在了有不就和都也]/.test(c1) ||
              /[的地得着了过们子]/.test(c2)) {
            continue;
          }
        }
        rawWords.push(slice);
        for (let k = i; k < i + len; k++) {
          used[k] = true;
        }
      }
    }
  }

  const stopWords = new Set([
    "我们", "你们", "他们", "她们", "它们", "自己", "一个", "两个", "三个",
    "这个", "那个", "这些", "那些", "这样", "那样", "怎么", "什么", "为什么",
    "因为", "所以", "但是", "可是", "然后", "还有", "或者", "如果", "虽然",
    "不是", "就是", "只是", "还是", "也是", "都是", "都不", "没有", "已经",
    "现在", "时候", "地方", "东西", "大家", "一起", "出来", "下去", "起来",
    "一下", "一点", "一样", "一直", "以前", "以后", "上面", "下面", "里面",
    "可以", "可能", "应该", "必须", "知道", "觉得", "认为", "看见", "听到",
    "人们", "它们", "显得", "变得", "显得", "有些", "有的", "一天", "一年",
    "十分", "非常", "特别", "比较", "马上", "刚才", "然后", "于是", "由于",
    "其实", "根本", "几乎", "大概", "差不多", "一样", "就是",
  ]);

  const filtered = rawWords.filter(
    (w) => !stopWords.has(w) && w.length >= 2 && w.length <= 4
  );

  const seen = new Set<string>();
  const result: string[] = [];
  for (const w of filtered) {
    if (!seen.has(w)) {
      seen.add(w);
      result.push(w);
    }
  }

  return result;
}

export function parseTextToWordItems(
  text: string,
  customLevel: 1 | 2 | 3 = 2
): ImportResult {
  const allWords = extractChineseWords(text);

  const wordItems: WordItem[] = allWords.map((word, index) => ({
    id: Date.now() + index,
    word,
    pinyin: wordToPinyin(word),
    level: customLevel,
  }));

  return {
    words: wordItems,
    totalFound: allWords.length,
    uniqueCount: wordItems.length,
    skippedShort: 0,
    skippedLong: 0,
  };
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else if (result instanceof ArrayBuffer) {
        const decoder = new TextDecoder("utf-8");
        resolve(decoder.decode(result));
      } else {
        resolve("");
      }
    };
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsText(file, "UTF-8");
  });
}

export const EXAMPLE_TEXT = `春天来了，小草从土里探出头来。
学校里同学们一起读书写字，老师夸奖大家很努力。
星期天我和爸爸妈妈去公园玩，看到美丽的花朵和可爱的小鸟。
小明是个勤劳勇敢的孩子，他每天都认真完成作业。
秋天到了，果园里挂满了苹果、梨子和橘子，农民伯伯脸上露出了开心的笑容。`;
