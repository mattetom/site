+++
date = 2026-06-19T05:00:00+00:00
featureImage = "/images/portfolio/geocam-feature.png"
postImage = "/images/portfolio/geocam-feature.png"
title = "How to Set a Blink Schedule for Each Camera (and When Geofencing Works Better)"
description = "How to set a Blink arm and disarm schedule in the app, step by step, how to give each camera its own timetable, and when location-based geofencing is the better trigger for your household (2026)."
tags = ["smart-home", "blink", "geofencing", "automation"]
categories = "blog"
geocamCTA = true
+++

If you have looked at any Blink automation thread in the last year, you have seen the same argument: *"just use schedules"* versus *"schedules are useless, you need geofencing"*. Both camps have a point, and both are usually wrong about why. The honest answer is that schedules and geofencing solve different problems, and the right choice depends on a small number of facts about your household.

This guide compares the two head-to-head, walks through four real-world scenarios where one wins decisively, and ends with a decision matrix you can use in 60 seconds. If you are looking for a feature-by-feature breakdown, the dedicated [GeoCam vs Blink Schedules](/blog/geocam-vs-blink-schedules/) page covers UI, setup time, and cost. This page is about *which behaviour fits your life*.

**TL;DR:** Schedules are clock-aware. Geofencing is location-aware. Schedules win for households with a strict, repeating timetable and people who do not always carry a phone. Geofencing wins everywhere else, especially for families and irregular routines. Most reliable households run both, with geofencing as the primary trigger and a schedule as the safety net.

## How to set a Blink schedule

In the official Blink app, a schedule belongs to a whole system, not to a single camera:

1. Open **Settings**, then **Device and System Settings**, and pick the system you want to schedule.
2. Check that the system's time zone is right, then open **Scheduling**.
3. On the weekly schedule, add an **arm** entry, set the time (in 15-minute steps) and tick the days, then save.
4. Add a matching **disarm** entry the same way.

A typical set of rules: **arm at 09:00 on weekdays, disarm at 18:00 on weekdays, arm at 23:00 every day, disarm at 07:00**. The schedule repeats weekly forever, until you edit it. You can switch it off under Scheduling without deleting it, which is handy before a trip.

Two details catch people out. The schedule wins over everything else: a manual, Alexa, or IFTTT arm or disarm only lasts until the next scheduled change. And because the schedule covers the whole system, the official app cannot give one camera a different timetable from the others.

### Scheduling each camera on its own

If you want the indoor cameras off during the day and on at night while the outdoor ones keep recording, you need a per-camera schedule. [GeoCam](https://geocam.matteotomasini.com/) does this with scheduled routines (Pro): pick a time and the days, then choose which cameras get motion detection turned on or off. For example, turn off motion on the living room camera at 07:00 and back on at 22:00, without touching the rest of the system and without a second Sync Module. The same routines can also follow your location, which is where the rest of this guide comes in.

What schedules cannot do:

- React to who is home and who is not.
- Skip themselves on bank holidays, school closures, or sick days.
- Adjust to a one-off late finish at work.
- Pause when a teenager comes home unexpectedly at 14:00.

If your week looks the same every week, schedules are quietly excellent: set once, never touch again. If your week varies, schedules generate two specific kinds of failure: **cameras armed while someone is still inside**, and **cameras disarmed while the house is empty**. The first is annoying. The second defeats the entire reason you bought cameras.

## How geofencing actually works

Geofencing arms and disarms cameras based on phone location, not the clock. You draw a circle around your house, typically 100 to 200 metres, and the operating system on each phone listens for a boundary crossing. When the last phone leaves the circle, your cameras arm. When any phone returns, they disarm.

What geofencing cannot do:

- Help you if you do not carry your phone with you.
- Distinguish between "left for the shops for ten minutes" and "left for the day". It only knows you are out.
- Arm cameras while you are home (useful for outdoor-only perimeter setups).

This is the core trade-off. Schedules know *when*. Geofencing knows *who is here*. Most households care more about the second.

## Four real-world scenarios

### Scenario 1: Hybrid / work-from-home week

Three days at the office, two days at home, occasional all-hands that rearrange everything. With schedules, you either pick the office days as default (and disarm manually on home days) or pick the home days as default (and arm manually on office days). Either way, you are doing it manually three times a week. With geofencing the cameras simply track where your phone is.

**Winner: geofencing.**

### Scenario 2: Shift work or irregular hours

Nurses, hospitality staff, parents juggling school runs. There is no repeating weekly pattern to encode. A schedule that worked in March is wrong by April. Geofencing does not care what the rota looks like: when you leave, the cameras arm; when you return, they disarm.

**Winner: geofencing.**

### Scenario 3: School holidays and family in and out

This is the most common reason people abandon schedules. The kids are out at school, then suddenly home for two weeks, then on a sleepover, then back. Schedules either arm the cameras with kids inside (false alerts, scared pets) or leave them disarmed when the house is empty (the worst-case failure). A family-aware geofence only arms when every paired phone has left, and disarms the moment any phone returns.

**Winner: geofencing, but only with family-aware logic.**

### Scenario 4: Outdoor perimeter cameras you want armed at night

If your cameras only watch the garden or driveway and you want them recording overnight regardless of who is home, location is the wrong question to ask. You want clock-based behaviour: arm at 22:00, disarm at 07:00. That is exactly what schedules are for.

**Winner: schedules.**

## The decision matrix

Run through these five questions. Two or more "geofencing" answers mean geofencing is your primary tool.

| Question | Pick |
| --- | --- |
| Does your household routine repeat the same way every week? | Yes: schedules. No: geofencing. |
| Is there more than one person in the house with their own movements? | Yes: family-aware geofencing. |
| Do school holidays, shift work, or remote-work days break your weekly pattern? | Yes: geofencing. |
| Do you reliably carry your phone with you when you leave home? | Yes: geofencing works. No: stick with schedules. |
| Do you want cameras armed even when you are home (outdoor perimeter)? | Yes: schedules. Geofencing will disarm whenever you are inside. |

## The "use both" pattern most reliable households end up on

You do not have to pick. The two systems run independently and reinforce each other.

- **Geofencing as the primary trigger.** Reacts to who is actually home, in real time, with no manual input.
- **A Blink schedule as the safety net.** Pick a window that is almost always going to be empty (for many households, 02:00 to 05:00) and add a forced-arm rule. If the geofence ever fails to trigger because of a phone that ran out of battery, the schedule still arms the cameras overnight.

This is the configuration we see most often in real-world setups, and it is the one we would recommend to a friend.

## What this looks like with GeoCam

[GeoCam](https://geocam.matteotomasini.com/) is a dedicated geofencing app for Blink, designed specifically for the family-aware case. You sign in with your Blink credentials, draw your zone, and add household members by installing the app on their phones with the same Blink account. Cameras only arm when every paired phone has left, and disarm the moment anyone returns. The whole household is covered by one subscription, 3.99 euro/month, flat, instead of paying per user. Setup takes about 60 seconds, and it sits alongside whatever schedule you already have in the Blink app.

## FAQ

**Do I have to choose between schedules and geofencing?**

No. They are independent systems. Schedules live inside the official Blink app. Geofencing comes from a dedicated app like GeoCam. Many households run both, with geofencing as the daily trigger and a schedule as a backup for late-night hours.

**What happens if my geofence misses an event?**

It is rare on modern iOS and Android, but possible if the phone OS aggressively kills background apps to save battery. The fix is twofold: grant "Always" location permission to your geofencing app, and run a backup Blink schedule that arms cameras during hours you are reliably out (or asleep).

**Will geofencing keep arming and disarming if I keep popping out for short errands?**

Yes, that is exactly the behaviour you want. The arm and disarm events are cheap, the cameras themselves do not wear out from being toggled, and you stay protected during the window you are out.

**Does geofencing need an internet connection?**

The geofence event itself runs offline on the phone. Sending the arm command to Blink needs a brief internet moment. If your phone is offline at the boundary crossing, the command queues until connectivity returns.

**Can I set different rules for different cameras?**

Within Blink, schedules apply per system. With geofencing, the trigger applies to whatever system you have linked. If you want outdoor cameras armed 24/7 and indoor cameras only when the house is empty, group them into separate Blink systems and apply different rules to each.

## Stop fighting your schedule. Try geofencing.

Family-aware, set up in 60 seconds, 3.99 euro/month for the whole household. Works alongside any Blink schedule you already have. [Download GeoCam](https://geocam.matteotomasini.com/#download).

### See also

- [How to auto-arm Blink cameras automatically](/blog/how-to-arm-blink-cameras-automatically/)
- [GeoCam vs Blink Schedules (feature comparison)](/blog/geocam-vs-blink-schedules/)
- [GeoCam vs IFTTT](/blog/geocam-vs-ifttt-blink/)
- [GeoCam vs Alexa](/blog/geocam-vs-alexa-blink/)

Ready to try it? [Get GeoCam for your household.](https://geocam.matteotomasini.com/#download)
