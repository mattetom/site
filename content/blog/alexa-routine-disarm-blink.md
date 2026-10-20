+++
date = 2026-10-19T08:00:00+00:00
featureImage = "/images/portfolio/geocam-feature.png"
postImage = "/images/portfolio/geocam-feature.png"
title = "Why Alexa Routines Can't Disarm Blink (and How to Disarm Automatically)"
description = "You can arm Blink with an Alexa routine, but Blink does not allow routines to disarm it, and voice disarm needs a code. Here is why, and how to disarm Blink automatically when you get home."
tags = ["smart-home", "blink", "alexa", "how-to"]
categories = "blog"
geocamCTA = true
+++

It is one of the most common Blink frustrations: you build an Alexa routine that arms the cameras when you leave, then try to build the opposite one for coming home, and the Disarm option is not there. It is not a bug in your setup.

## What Blink allows with Alexa

From Blink's own support page on arming and disarming with Alexa:

- **Arming:** you can arm by voice ("Alexa, arm [system name]") or with a routine.
- **Disarming by voice:** works, but the Alexa voice code is required.
- **Disarming with a routine:** not possible. In Blink's words, "You cannot disarm your system with Alexa Routines."

The reason is security. A routine runs without anyone confirming who triggered it, so Blink does not let one turn the alarm off.

## What that means for location automations

An Alexa routine with a location trigger can arm Blink when your phone leaves home. Nothing on the Alexa side can disarm it when you come back. In practice you are left with three choices:

- say "Alexa, disarm" plus your voice code every time you walk in;
- open the Blink app and disarm by hand;
- leave the cameras armed and live with the recordings and notifications of yourself coming home.

## How to disarm Blink automatically when you arrive

The disarm has to come from something that talks to Blink directly and knows your phone has arrived:

- **IFTTT:** its Blink service has a Disarm system action, and an applet can run it when your phone enters your home area. Two applets (arm and disarm) are the whole free plan, and each follows a single phone. See [GeoCam vs IFTTT](/blog/geocam-vs-ifttt-blink/).
- **Home Assistant:** an automation on your phone's presence can call the Blink integration, if you run a server.
- **GeoCam:** [GeoCam](https://geocam.matteotomasini.com/) arms Blink when you leave and disarms it when you come back, on iPhone and Android. That pair is free on one phone. With Pro, the whole family counts: it disarms when the first person is back and arms only when the last one leaves.

You can keep Alexa for what it does well, voice commands and time-based routines, and let location arming and disarming run through a tool that can do both directions.

## FAQ

**Why is there no Disarm action in my Alexa routine for Blink?**

Because Blink does not allow it. Blink's support documentation states that you cannot disarm your system with Alexa Routines; only arming is available in routines.

**Can I disarm Blink with Alexa at all?**

Yes, by voice: "Alexa, disarm [system name]", followed by your Alexa voice code.

**Can I skip the voice code?**

The voice code is required for disarming through Alexa. To disarm without speaking, use the Blink app or an automation that talks to Blink directly, such as GeoCam or IFTTT.

**Does GeoCam replace Alexa?**

No, they work side by side. GeoCam handles arming and disarming by location; Alexa can still arm by voice or on a schedule.

### See also

- [GeoCam vs Alexa Routines for Blink](/blog/geocam-vs-alexa-blink/)
- [How to Arm Blink Only When the Last Person Leaves](/blog/arm-blink-when-last-person-leaves/)
- [Blink Geofencing on Android](/blog/blink-geofencing-android/)
- [How to make Blink cameras arm automatically](/blog/how-to-arm-blink-cameras-automatically/)

[Try GeoCam](https://geocam.matteotomasini.com/#download): automatic disarm when you get home, free on one phone.
