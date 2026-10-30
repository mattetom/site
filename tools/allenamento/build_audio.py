#!/usr/bin/env python3
"""Build the listening audio of an exercise in static/allenamento-tlyp0q/ from its script.json.

macOS only: uses `say` (British voices) and `afconvert`. Writes, next to script.json, audio/:
  <part>-full.m4a   the whole part as in the exam (intro, example, questions with pauses)
  <part>-q<n>.m4a   one question only, used to listen again to the wrong ones
  <part>-intro.m4a  intro and example only (the speaking practice plays this, then one question at a time)

Usage: python3 tools/allenamento/build_audio.py static/allenamento-tlyp0q/cambridge-listening-1
"""
import hashlib
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

RATE = {"R": 150, "F": 158, "M": 158, "G": 165, "B": 165}  # words per minute, exam-like pace
SR = 22050
PAUSE_LINE = 0.55   # between two lines of a dialogue
PAUSE_BLOCK = 1.2   # after the intro and the example
PAUSE_QUESTION = 4.0  # time to answer, after each question

cache = Path(tempfile.gettempdir()) / "allenamento-tts-cache"
cache.mkdir(exist_ok=True)


def line_wav(voice, rate, text):
    h = hashlib.sha1(f"{voice}|{rate}|{text}".encode()).hexdigest()[:16]
    out = cache / f"{h}.wav"
    if not out.exists():
        subprocess.run(["say", "-v", voice, "-r", str(rate), "--file-format=WAVE",
                        f"--data-format=LEI16@{SR}", "-o", str(out), text], check=True)
    with wave.open(str(out)) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2
        return w.readframes(w.getnframes())


def silence(sec):
    return b"\x00\x00" * int(SR * sec)


def lines_audio(voices, lines):
    out = b""
    for i, (who, text) in enumerate(lines):
        if i:
            out += silence(PAUSE_LINE)
        out += line_wav(voices[who], RATE[who], text)
    return out


def write_m4a(frames, dest):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as t:
        tmp = t.name
    with wave.open(tmp, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(frames)
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "48000", tmp, str(dest)], check=True)
    Path(tmp).unlink()
    return len(frames) / 2 / SR


def main(folder):
    folder = Path(folder)
    script = json.loads((folder / "script.json").read_text(encoding="utf-8"))
    voices = script["voices"]
    adir = folder / "audio"
    adir.mkdir(exist_ok=True)
    for part in script["parts"]:
        full = lines_audio(voices, part["intro"]) + silence(PAUSE_BLOCK)
        full += lines_audio(voices, part["exampleLines"]) + silence(PAUSE_BLOCK)
        write_m4a(full, adir / f"{part['id']}-intro.m4a")
        for q in part["questions"]:
            one = lines_audio(voices, q["lines"])
            full += one + silence(PAUSE_QUESTION)
            write_m4a(one + silence(0.5), adir / f"{part['id']}-q{q['q']}.m4a")
        full += line_wav(voices["R"], RATE["R"], "That is the end of " + part["title"] + ".")
        secs = write_m4a(full, adir / f"{part['id']}-full.m4a")
        print(f"{part['id']}: {secs:.0f} s")


if __name__ == "__main__":
    main(sys.argv[1])
