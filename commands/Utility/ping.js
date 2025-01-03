import axios from "axios";
import fs from "fs";
import path from "path";

async function randomImageAndUptime({ api, event }) {
    try {
        const searchQueries = ["zoro", "madara", "obito", "luffy", "boa Hancock", "kaguya sama", "hinata hyuga", "itashi", "nezuko", "rim rezero", "nami"]; // إضافة استعلامات البحث عن الصور هنا

        const randomQueryIndex = Math.floor(Math.random() * searchQueries.length);
        const searchQuery = searchQueries[randomQueryIndex];

        // استخدام الاستعلام العشوائي في الرابط الجديد
        const apiUrl = `https://smfahim.xyz/pin?title=${encodeURIComponent(searchQuery)}&search=1`;

        const response = await axios.get(apiUrl);
        const imageLinks = response.data.data; // استخراج الروابط من البيانات المسترجعة

        if (imageLinks.length === 0) {
            return api.sendMessage(`لم يتم العثور على صور للاستعلام: ${searchQuery}`, event.threadID, event.messageID);
        }

        const imageUrl = imageLinks[0]; // جلب الصورة الأولى فقط

        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imagePath = path.join(process.cwd(), 'cache', `uptime_image.jpg`);
        await fs.promises.writeFile(imagePath, imageResponse.data);

        const uptime = process.uptime();
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));

        let uptimeString = `${days} من الايام\nو ${hours} من الساعات\nو ${minutes} من الدقائق\nو ${seconds} من الثواني`;
        if (days === 0) {
            uptimeString = `${hours} من الساعات\nو ${minutes} من الدقائق\nو ${seconds} من الثواني`;
            if (hours === 0) {
                uptimeString = `${minutes} من الدقائق \nو  ${seconds} من الثواني`;
                if (minutes === 0) {
                    uptimeString = `${seconds} ثانية`;
                }
            }
        }

        const message = `✿━━━━━━━━━━━━━━━✿\n 🔖 | تحياتي ! كاغويا البوت\nكانت شغالة منذ :\n${uptimeString}\n✿━━━━━━━━━━━━━━━✿`;
        const imageStream = fs.createReadStream(imagePath);

        api.setMessageReaction("🚀", event.messageID, (err) => {}, true);

        await api.sendMessage({
            body: message,
            attachment: imageStream
        }, event.threadID, event.messageID);

        await fs.promises.unlink(imagePath);
    } catch (error) {
        console.error(error);
        return api.sendMessage(`حدث خطأ أثناء جلب الصورة أو حساب مدة التشغيل.`, event.threadID, event.messageID);
    }
}

export default {
    name: "اوبتايم",
    description: "مدة تشغيل البوت.",
    aliases:["up","ابتايم"],
    execute: randomImageAndUptime
};
