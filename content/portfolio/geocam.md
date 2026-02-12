---
title: GeoCam
date: 2026-02-12T10:00:00+00:00
draft: false
thumbnail: images/portfolio/geocam-feature.png
hideMainImage: true
service: Mobile App Development, Geofencing UX
client: Personal Project
shortDescription: GeoCam adds geofencing automation to Blink Smart Security, arming cameras when you leave and disarming when you return home.
challenge: Blink users often need to manually arm and disarm cameras, which is easy to forget during daily routines and creates friction for families with different schedules.
solution: I designed GeoCam to automate arm/disarm flows with location-based triggers, configurable home zones, and multi-user logic so households can stay protected with less manual effort.
screenshots:
  - images/portfolio/geocam-store-1.png
  - images/portfolio/geocam-store-2.png
  - images/portfolio/geocam-store-3.png
playStoreURL: https://play.google.com/store/apps/details?id=com.matteotomasini.geoblink
appStoreURL: https://apps.apple.com/it/app/geocam/id6447012622
---
GeoCam started from a practical, repeated pain point: remembering to open Blink and manually switch camera status every time leaving or returning home.

The goal was to make home security feel automatic. Instead of adding another daily task, GeoCam uses geofencing so Blink follows presence in the background.

## Project goals

- Remove repetitive manual arm/disarm actions from everyday routines.
- Make setup simple: define a home zone once, then let automation run.
- Support iOS and Android with a consistent user experience.
- Handle family use cases where arming should happen only when everyone has left.

## Product direction

The product focuses on reliability and low-friction interaction:

- One-time setup with Blink account connection and custom home geofence.
- Automatic state transitions when crossing zone boundaries.
- Adjustable geofence sensitivity and radius for different environments.
- Pro workflow for multi-device households.

## Technical and UX decisions

- Geofencing logic is tuned for practical commute patterns, not only perfect GPS conditions.
- The app is designed to work quietly in the background with minimal user intervention.
- Onboarding emphasizes quick setup and immediate value instead of advanced configuration first.
- Messaging and UI copy reduce ambiguity around when cameras arm or disarm.

## Why this project matters

GeoCam is an example of utility-driven product design: a focused app that solves one recurring behavior problem well. The value is not in adding more screens, but in removing daily cognitive load while keeping home protection reliable.

## Project links and visuals

- Live website: [geocam.matteotomasini.com](https://geocam.matteotomasini.com)
