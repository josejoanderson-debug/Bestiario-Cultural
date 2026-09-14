const terms = [
  ["repente-cordel", "literatura de cordel Brazil"], ["fandango", "fandango caiçara Brazil"], ["fandango-ctg", "fandango CTG Brazil"], ["ciranda", "ciranda Brazil dance"], ["pastoril", "pastoril Brazil"], ["folguedo", "folguedo Brazil dance"], ["reisado", "reisado Brazil"], ["xaxado", "xaxado Brazil"], ["artesanato-de-barro", "cerâmica artesanal Brazil"], ["renda-renascenca", "renda renascença Brazil"], ["lapinha", "lapinha presépio Brazil"], ["festa-de-sao-joao", "festa junina Brazil"],
];

for (const [slug, query] of terms) {
  const params = new URLSearchParams({ action: "query", format: "json", generator: "search", gsrsearch: query, gsrnamespace: "6", gsrlimit: "3", prop: "imageinfo", iiprop: "url|extmetadata" });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { "user-agent": "Bestiario Cultural source research" } });
  const payload = await response.json();
  const pages = Object.values(payload.query?.pages ?? {}).map((page) => {
    const info = page.imageinfo?.[0] ?? {};
    const license = info.extmetadata?.LicenseShortName?.value ?? "";
    return { title: page.title, url: info.descriptionurl, image: info.thumburl ?? info.url, license };
  });
  console.log(JSON.stringify({ slug, query, pages }, null, 2));
}
