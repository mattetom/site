+++
date = 2026-10-19T08:00:00+00:00
featureImage = "/images/portfolio/geocam-feature.png"
postImage = "/images/portfolio/geocam-feature.png"
title = "How to Arm Blink Only When the Last Person Leaves Home"
description = "Single-phone automations arm Blink while your partner is still inside. How to arm only when everyone is out and disarm when the first person is back, and which tools can actually do it."
tags = ["smart-home", "blink", "geofencing", "family"]
categories = "blog"
geocamCTA = true
+++

The first location automation most people build for Blink works fine until the day it arms the cameras while a partner or child is still at home, or disarms them for an empty house. The reason is simple: the automation follows **one phone**. What a household needs is different: arm when the **last** person leaves, disarm when the **first** person is back.

## Why single-phone automations get it wrong

Every common workaround reacts to a single device:

- **IFTTT location applets** fire when the phone running that IFTTT account crosses the area. Another person's phone has its own applets, which do not know about yours. See [GeoCam vs IFTTT](/blog/geocam-vs-ifttt-blink/).
- **Alexa routines** use the location of the phone running the Alexa app, and Blink does not let routines disarm the system at all. See [why Alexa routines can't disarm Blink](/blog/alexa-routine-disarm-blink/).
- **Apple Shortcuts** automations run on each iPhone separately, and nothing is available on Android.

With two people and two single-phone automations, the cameras end up in whatever state the last phone to move decided, not the state the house is actually in.

## What "last person out" logic needs

1. **Every phone in the household reports** whether it is home or away.
2. **One place keeps the combined state**: home if anyone is home, away only when everyone is away.
3. **Arm on the transition to "everyone away"**, and disarm as soon as the first person is back.
4. **A safety net**: a phone that is off or out of battery should not leave the house disarmed forever.

## The ways to get it

### Home Assistant

Home Assistant can do it if you run a server: each phone runs the Companion app, a group of people is "home" while anyone is home, and an automation arms or disarms Blink on changes of the group. Flexible, but you maintain the server and the unofficial Blink integration. See [GeoCam vs Home Assistant](/blog/geocam-vs-home-assistant-blink/).

### GeoCam Pro

[GeoCam](https://geocam.matteotomasini.com/) has the household logic built in. Each family member installs GeoCam and signs in with the same Blink account, and each phone reports home or away for your home area. The system arms when the last phone leaves and disarms when the first one comes back. You can see and rename the phones that count under Family devices, and choose who takes part in each routine.

Family presence is part of GeoCam Pro: €3.99 a month or €39.99 a year for the whole household, with a 7-day free trial. Arm on leave and disarm on arrive for a single phone are free.

## Tips for a reliable household setup

- **Use one home area for everyone**, wide enough to cover the driveway or parking: 150 to 200 metres works for most houses.
- **Grant "Always" location on every phone**, and on Android set the battery to "Unrestricted".
- **Keep a schedule as a backup** for nights, if your household wants the cameras armed at bedtime regardless of who is home.

## FAQ

**Can Blink arm only when everyone has left?**

Not by itself. The Blink app has no location features. You need an app or system that combines the location of several phones, such as GeoCam Pro or Home Assistant.

**Does each family member need their own Blink account?**

No. With GeoCam every family phone signs in with the same Blink account and joins the household automatically.

**What happens if one phone is off?**

The phone keeps its last known state. That is why each family phone should be in the routine only if it is normally carried, and why a nightly schedule is a useful backup.

**Can IFTTT do "last person out" for Blink?**

Not directly. Each IFTTT location applet reacts to one phone, so two people need separate applets that do not know about each other.

### See also

- [Blink Geofencing on Android](/blog/blink-geofencing-android/)
- [Can You Arm Individual Blink Cameras?](/blog/arm-individual-blink-cameras/)
- [The Best Blink Geofencing App in 2026](/blog/best-blink-geofencing-app/)
- [Blink Schedules vs Geofencing](/blog/blink-schedules-vs-geofencing/)

[Try GeoCam](https://geocam.matteotomasini.com/#download): free on one phone, Pro for the whole family.
