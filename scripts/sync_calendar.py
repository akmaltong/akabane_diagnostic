import os, re, json, datetime as dt, urllib.request
import icalendar, recurring_ical_events
from zoneinfo import ZoneInfo

TZ = ZoneInfo("Asia/Dushanbe")
SKIP = re.compile(r"тайцзи|поехать|семинар|\bи\b", re.I)  # не персональные события

raw = urllib.request.urlopen(os.environ["ICAL_URL"], timeout=60).read()
cal = icalendar.Calendar.from_ical(raw)
now = dt.datetime.now(TZ)
events = recurring_ical_events.of(cal).between(now - dt.timedelta(days=60), now + dt.timedelta(days=90))
out = []
for ev in events:
    title = str(ev.get("SUMMARY", "")).strip()
    s = ev.decoded("DTSTART")
    if not isinstance(s, dt.datetime) or not title or SKIP.search(title):
        continue
    e = ev.decoded("DTEND") if ev.get("DTEND") else s + dt.timedelta(hours=1)
    s, e = s.astimezone(TZ), e.astimezone(TZ)
    out.append({"id": f"{ev.get('UID')}_{s.strftime('%Y%m%dT%H%M')}", "title": title,
                "start": s.isoformat(), "end": e.isoformat()})
out.sort(key=lambda x: x["start"])
json.dump(out, open("shared/calendar-events.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(out), "events")
