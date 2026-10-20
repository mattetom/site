+++
date = 2026-10-19T08:00:00+00:00
featureImage = "/images/portfolio/geocam-feature.png"
postImage = "/images/portfolio/geocam-feature.png"
title = "Can You Arm Individual Blink Cameras? (Yes, Here's How)"
description = "Blink arms a whole system at once, but you can turn motion detection on or off camera by camera. How to do it in the Blink app, where it stops, and how to make single cameras follow you or a schedule."
tags = ["smart-home", "blink", "automation", "how-to"]
categories = "blog"
geocamCTA = true
+++

A common Blink setup question: "I want the outdoor cameras on all the time, but the indoor ones off while we are home. Can I arm just one camera?" The short answer is yes, with a catch. Blink arms and disarms a whole **system** (everything on one Sync Module), but each camera has its own **motion detection** switch, and that is what decides whether it records and notifies.

## How arming works in Blink

- **System arm and disarm** applies to every camera on the system at once.
- **Motion detection per camera** decides which cameras react while the system is armed. Blink's example: with the Front Door camera's motion detection on and the Living Room camera's off, motion at the front door creates a notification and motion in the living room does not.

So "arming one camera" really means: arm the system, then turn motion detection off on the cameras you want quiet.

## How to turn one camera on or off in the Blink app

1. Arm the system. Blink requires the system to be armed before you can enable motion detection on a camera.
2. On the camera's thumbnail, tap the More button.
3. Open **Device Settings**, then **Motion Settings**.
4. Switch **Motion Detection** on or off for that camera.

The choice stays in place when the system is armed again, so you can leave the indoor cameras off and keep arming and disarming the system as usual.

## Where it stops

- **It is manual.** Blink schedules arm and disarm the whole system, so the official app cannot turn the living room camera off at 7:00 and back on at 22:00 by itself, or switch it when you leave home. More on what schedules can and cannot do in [How to Set a Blink Schedule for Each Camera](/blog/blink-schedules-vs-geofencing/).
- **The other route costs hardware.** The way to get truly separate "zones" in Blink is a second Sync Module, so the indoor and outdoor cameras sit in two systems that you arm separately.

## Making single cameras follow you or a schedule

[GeoCam](https://geocam.matteotomasini.com/) adds the automation Blink is missing. With GeoCam Pro, a routine can turn motion detection on or off for the cameras you pick:

- **When you leave or arrive:** for example, indoor cameras on when the last person leaves, off when someone comes home, while the outdoor cameras never change.
- **At set times:** for example, the living room camera off at 7:00 and back on at 22:00 on weekdays.
- **Together with the system:** a routine can arm the system and turn on specific cameras in the same step.

No second Sync Module, and it works with the Blink system you already have. GeoCam's free plan arms and disarms the whole system when you leave and come back on one phone; per-camera routines, schedules and the whole family are part of Pro (€3.99 a month or €39.99 a year, with a 7-day free trial).

## FAQ

**Can you arm just one Blink camera?**

Not as a separate system. Blink arms the whole system, but you can switch motion detection off on the cameras you want quiet, so only the others record and notify.

**Can I schedule a single Blink camera?**

Not in the Blink app, whose schedules cover the whole system. GeoCam Pro can turn motion detection on or off for single cameras at set times or when you leave and arrive.

**Do I need a second Sync Module to split indoor and outdoor cameras?**

Only if you want to arm them as two separate systems from the Blink app. Per-camera motion detection, manual or automated with GeoCam, gives the same result on one Sync Module.

**Does turning off motion detection stop live view?**

No. Motion detection only controls motion recordings and alerts. You can still open live view on that camera.

### See also

- [How to Set a Blink Schedule for Each Camera](/blog/blink-schedules-vs-geofencing/)
- [How to Arm Blink Only When the Last Person Leaves](/blog/arm-blink-when-last-person-leaves/)
- [Blink Geofencing on Android](/blog/blink-geofencing-android/)
- [Does Blink Have Geofencing?](/blog/does-blink-have-geofencing/)

[Try GeoCam](https://geocam.matteotomasini.com/#download) to make single Blink cameras follow you.
