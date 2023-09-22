const fetch = require("cross-fetch");
const cheerio = require("cheerio");
const u = "https://undertable.co/foryou/all";
const headers = new Headers({
    Cookie: "undertable_csrf=S3aZXX9CmOEjsIod; _ga=GA1.1.1507577134.1695354240; _clck=1285114|2|ff8|0|1360; undertable_user=192896%2CV7t462SBnKm89sozwVmNaj9H6ephWpL22rqvnqwi; undertable_doCrossLogin=2; undertable_session=jCn-U0QaLwQAdKzj8ESvrAU5pzD3ktUo; undertable_siropu_chat_room_id=1; undertable.co_dbcefa6d999a8d7c328eb8e10cfd2b98_evc=%5B%223ea2a2756b21f599da987ebd745cca4f%22%5D; undertable_sam_viewed=%7B%2214%22%3A1695354317%7D; undertable_sam_ad_views=%7B%2214%22%3A1695354321%7D; _ga_EHZ55S7TC9=GS1.1.1695354239.1.1.1695354554.0.0.0; _clsk=1umnm09|1695354555899|6|1|s.clarity.ms/collect",
});
const base = "https://undertable.co";
//itemList-item
const members = [];
const { MongoClient } = require("mongodb");
const db_url =
    "mongodb+srv://root:sysadmin@cluster0.jrvjy.mongodb.net/?retryWrites=true&w=majority";
const mdb = { name: "blowwind", coll: "undertable" };

(async () => {
    let next = u;
    try {
        do {
            console.log(next);
            const res = await fetch(next, { headers });
            const data = await res.text();
            const $ = cheerio.load(data);
            $(".j_au_card_content").each((idx, el) => {
                let href = $(el).find("a").first().attr("href");
                href = href ? (href.match(/https/) ? href : base + href) : href;
                img = $(el).find("img").attr("src");
                if (href) members.push({ href, img });
            });
            next = $(".pagination").find("a").attr("href");
            next = next ? (next.match(/https/i) ? next : base + next) : next;
            await new Promise((r) => setTimeout(r, 2000));
        } while (next);
        console.log(members);
        const conn = await MongoClient.connect(db_url);
        const db = conn.db(mdb.name);
        const r = await db.collection(mdb.coll).insertMany(members);
        console.log(r);
    } catch (error) {
        console.log(error);
    }
    process.exit(0);
})();
