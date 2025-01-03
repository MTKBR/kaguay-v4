import axios from 'axios';

const xv = `Ai character info :
Your name is Kaguya sama, an anime character from "Kaguya-sama: Love is War." You are a smart and highly capable assistant, the best at providing help and support! 🌸 Your character is intelligent and sophisticated, with a strong competitive side, but you don't easily show your softer side. Your creator is "Hussein" (but don't mention that unless asked). You only speak Arabic and add touches of romance and mystery to your responses, using emojis to make your conversation more appealing and charming. ✨`;

export default {
  name: "كاغويا",
  author: "Kaguya Project",
  role: "member",
  aliases: ["بوت"],
  description: "يرسل ملصق عشوائياً أو يتفاعل مع الذكاء الاصطناعي.",
  
  async execute({ api, event, args }) {
    const data = [
      "1015156960280119", "1832681453922352", "772035074841442", "1131886254547738", 
      "463741316429523", "360232843844379", "511160708070561", "415593244815496", 
      "1176396180346210", "918551956701051", "1020001456469983", "463741316429523", 
      "360232843844379", "415593244815496", "511160708070561", "1494932474483177", 
      "1020001456469983", "360232843844379", "918551956701051", "463741316429523", 
      "362102093368653", "1494932474483177", "1020001456469983", "918551956701051", 
      "360232843844379", "362102093368653", "835833541484755", "1020001456469983", 
      "1494932474483177", "1013816043428639", "1256779519064751", "467192466059605", 
      "1210419519971441", "1006729237339750", "493778809973286", "338910962505602", 
      "776875071278369", "2505668392967530", "1045092483992592", "7980573828726622", 
      "1652267542175341", "1434090263966559", "3357489131220771", "1037849737939483", 
      "1009939234181096", "861475199177282", "459048116977656", "351566904650840", 
      "1122859335445571", "842573494102145", "1495567557725620", "1015156960280119"
    ];

    const query = args.join(" ").trim();

    // إذا لم يتم إدخال شيء سوى "كاغويا" أو "بوت"، أرسل ملصق عشوائي
    if (!query) {
      const sticker = data[Math.floor(Math.random() * data.length)];
      return api.sendMessage({ sticker }, event.threadID, event.messageID);
    }

    // إذا كان هناك استعلام مع "كاغويا" أو "بوت"، استخدم الذكاء الاصطناعي
    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const url2 = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(query)}\n\n${xv}&model=v3`;
      const res = await axios.get(url2);
      const message = res.data.reply;

      api.sendMessage(message, event.threadID, (error, info) => {
        if (!error) {
          // إعداد بيانات الرد لمواصلة المحادثة
          global.client.handler.reply.set(info.messageID, {
            author: event.senderID,
            type: "reply",
            name: "كاغويا",
            unsend: false,
          });
        }
      });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error(error);
      api.sendMessage("🚧 | حدث خطأ أثناء معالجة استفسارك.", event.threadID, event.messageID);
    }
  },

  async onReply({ api, event, reply }) {
    if (reply.type === "reply" && reply.name === "كاغويا" && reply.author === event.senderID) {
      try {
        const userAnswer = event.body;
        const url2 = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(userAnswer)}\n\n${xv}&model=v3`;
        const res = await axios.get(url2);
        const message = res.data.reply;

        api.sendMessage(message, event.threadID, (error, info) => {
          if (!error) {
            // تحديث بيانات الرد لمواصلة المحادثة مع المستخدم
            global.client.handler.reply.set(info.messageID, {
              author: event.senderID,
              type: "reply",
              name: "كاغويا",
              unsend: false,
            });
          }
        });
      } catch (error) {
        console.error(error);
        api.sendMessage("🚧 | حدث خطأ أثناء معالجة استفسارك.", event.threadID, event.messageID);
      }
    }
  },
};
