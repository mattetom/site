+++
date = 2026-06-19T05:00:00+00:00
featureImage = "/images/portfolio/geocam-feature.png"
postImage = "/images/portfolio/geocam-feature.png"
title = "GeoCam vs Home Assistant for Blink Geofencing"
description = "Home Assistant geofences Blink only via the unofficial blinkpy integration plus YAML automations on a server you maintain. GeoCam needs none of that, just an app."
tags = ["smart-home", "blink", "geofencing", "home-assistant"]
categories = "blog"
+++

Home Assistant is a powerhouse for people who already run a smart-home server. But to make it geofence Blink, you stitch together an unofficial integration, a device tracker, and YAML automations on hardware you have to keep alive. GeoCam delivers the same outcome with an app install and a five-minute setup, and one 3.99 euro plan covers everyone in the house.

## What you actually have to assemble

Blink has no first-party Home Assistant integration. To geofence Blink in HA you put together this stack:

**1. A machine that runs Home Assistant 24/7.** Raspberry Pi 4 or 5, an Intel NUC, a small NAS with a Docker runtime, or a hosted Nabu Casa instance. The box has to be on whenever you want Blink to react.

**2. The community Blink integration.** The bundled HA Blink integration is community-maintained and built on the reverse-engineered `blinkpy` library. When Amazon changes the Blink API (which is undocumented), users wait for a maintainer fix before automations work again.

**3. A device tracker per household phone.** You install the Home Assistant Companion app on every phone, configure a zone, and HA exposes a `person.*` entity that flips between `home` and `not_home`.

**4. YAML automations.** Two automations at minimum, in `automations.yaml` or via the UI: one triggered on zone leave (call `blink.arm`), one on zone enter (call `blink.disarm`). Multi-person presence is a third condition with templating.

**5. Ongoing maintenance.** HA core releases monthly; the Blink integration occasionally breaks on upgrade. Push notifications rely on the Companion app's push service. When something goes wrong, debugging spans HA logs, integration GitHub issues, and the Companion app settings.

## Where Home Assistant geofencing falls short for Blink-only households

- **The Blink integration is unofficial.** When Blink's API changes, your automations stop firing until the community ships a fix. There is no SLA. This has happened multiple times in the integration's history.
- **Always-on infrastructure.** A Pi or NUC sitting in a closet draws power 24/7 and is one SD-card failure or one Wi-Fi dropout away from your cameras not arming. GeoCam runs on the phones you already carry.
- **Setup is not casual.** Even with HACS and the UI editor, configuring zones, persons, automations, and notifications is hours of reading docs. For a household where only one person is technical, this often means only that person can fix it when it breaks.

## How GeoCam handles the same job

GeoCam runs entirely on your phone. It signs in to your Blink account, you set a zone on a map, and the OS-level geofence APIs (Core Location on iOS, Geofencing API on Android) handle transitions even when the app is closed. There is no server to maintain, no integration to update, no device tracker to configure. GeoCam Pro adds household phones with built-in last-out / first-in logic, no YAML templating, and one 3.99 euro/month subscription covers every phone in the family.

For a step-by-step on the GeoCam side, see [how to arm Blink cameras automatically](/blog/how-to-arm-blink-cameras-automatically/).

## Side-by-side

| Aspect | GeoCam | Home Assistant + Blink |
| --- | --- | --- |
| Infrastructure required | Phone only | Always-on HA host (Pi, NUC, NAS, or cloud) |
| Blink integration status | First-party app, single owner | Community integration on unofficial API |
| Setup time | ~5 minutes | Hours, plus host setup |
| Who in the household can fix it | Anyone with the app | Whoever maintains the HA install |
| Family-friendly pricing | 3.99 euro/mo per household (unlimited phones) | Free software, but hardware + electricity + your time |

## Best fit

**Choose GeoCam** if Blink home/away is the automation you actually want, you don't have a smart-home server you're already running, and you want everyone in the house covered on one subscription.

**Choose Home Assistant** if you already maintain an HA install with dozens of devices and you want Blink as one more entity in the same dashboard, accepting the integration's unofficial status.

## FAQ

**Can Home Assistant geofence my Blink cameras out of the box?**

No. Home Assistant has no first-party Blink integration. Geofencing Blink in HA requires the community-maintained blinkpy integration, the Companion app on every household phone for presence, and YAML automations to call Blink services on zone enter/leave.

**What hardware do I need to run Home Assistant for Blink geofencing?**

At minimum a device that runs Home Assistant 24/7, typically a Raspberry Pi 4, an Intel NUC or mini-PC, a NAS with a Docker host, or a hosted HA instance. Plus the HA Companion app on every household phone.

**Should I choose GeoCam or Home Assistant?**

Choose GeoCam if Blink home/away is the automation you actually want and you don't already run a smart-home server. Choose Home Assistant if you already operate one and want Blink to live alongside dozens of other devices in a single dashboard.

### See also

- [GeoCam vs IFTTT](/blog/geocam-vs-ifttt-blink/)
- [GeoCam vs Alexa](/blog/geocam-vs-alexa-blink/)
- [GeoCam vs Blink Schedules](/blog/geocam-vs-blink-schedules/)
- [How to arm Blink cameras automatically](/blog/how-to-arm-blink-cameras-automatically/)

Ready to skip the server and the YAML? [Try GeoCam](https://geocam.matteotomasini.com/#download).
