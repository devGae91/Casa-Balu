async function loadICal(url) {
  const res = await fetch(url);
  const text = await res.text();

  const dates = [];
  const regex = /DTSTART;VALUE=DATE:(\d+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const d = match[1];
    dates.push(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`);
  }

  fp.set("disable", dates);
}
