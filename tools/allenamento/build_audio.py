#!/usr/bin/env python3
"""Build the listening audio of an exercise in static/allenamento-tlyp0q/ from its script.json.

Two engines, chosen by "engine" in script.json:
  "say"    (default) macOS `say` with the British system voices. Free, offline, rather robotic.
  "google" Google Cloud Text-to-Speech, neural en-GB voices (Chirp 3 HD). Much closer to the
           actors of the real Cambridge recordings. Uses the gcloud user token and bills the
           project in $TTS_PROJECT (default casatomoassistant), which must have the
           texttospeech API enabled. A whole Movers listening is ~15,000 characters, far inside
           the monthly free allowance.
Both need `afconvert` (macOS). Writes, next to script.json, audio/:
  <part>-full.m4a   the whole part as in the exam (intro, example, questions with pauses)
  <part>-q<n>.m4a   one question only, used to listen again to the wrong ones
  <part>-intro.m4a  intro and example only (the speaking practice plays this, then one question at a time)

Every synthesized line is cached in the temp folder, so re-running after a text change only
synthesizes the changed lines.

Usage: python3 tools/allenamento/build_audio.py static/allenamento-tlyp0q/cambridge-listening-1
       python3 tools/allenamento/build_audio.py <folder> --sample   # only the intro and example of part 1
"""
import base64
import hashlib
import io
import json
import os
import subprocess
import sys
import tempfile
import urllib.request
import wave
from pathlib import Path

# say: words per minute. google: speakingRate (1.0 = normal). Exam-like, unhurried pace.
RATE = {
    "say": {"R": 150, "F": 158, "M": 158, "G": 165, "B": 165},
    "google": {"R": 0.92, "F": 0.94, "M": 0.94, "G": 0.97, "B": 0.97},
}
SR = {"say": 22050, "google": 24000}
PAUSE_LINE = 0.55   # between two lines of a dialogue
PAUSE_BLOCK = 1.2   # after the intro and the example
PAUSE_QUESTION = 4.0  # time to answer, after each question

cache = Path(tempfile.gettempdir()) / "allenamento-tts-cache"
cache.mkdir(exist_ok=True)
engine = "say"
_token = None


def frames_of(path_or_bytes):
    src = io.BytesIO(path_or_bytes) if isinstance(path_or_bytes, bytes) else str(path_or_bytes)
    with wave.open(src) as w:
        assert w.getframerate() == SR[engine] and w.getnchannels() == 1 and w.getsampwidth() == 2
        return w.readframes(w.getnframes())


def google_tts(voice, rate, text, out):
    global _token
    if _token is None:
        _token = subprocess.run(["gcloud", "auth", "print-access-token"], capture_output=True,
                                text=True, check=True).stdout.strip()
    body = {
        "input": {"text": text},
        "voice": {"languageCode": voice[:5], "name": voice},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": SR["google"], "speakingRate": rate},
    }
    req = urllib.request.Request(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {_token}", "Content-Type": "application/json",
                 "x-goog-user-project": os.environ.get("TTS_PROJECT", "casatomoassistant")})
    with urllib.request.urlopen(req, timeout=60) as r:
        out.write_bytes(base64.b64decode(json.load(r)["audioContent"]))


def line_wav(voice, who, text):
    rate = RATE[engine][who]
    h = hashlib.sha1(f"{engine}|{voice}|{rate}|{text}".encode()).hexdigest()[:16]
    out = cache / f"{h}.wav"
    if not out.exists():
        if engine == "google":
            google_tts(voice, rate, text, out)
        else:
            subprocess.run(["say", "-v", voice, "-r", str(rate), "--file-format=WAVE",
                            f"--data-format=LEI16@{SR['say']}", "-o", str(out), text], check=True)
    return frames_of(out)


def silence(sec):
    return b"\x00\x00" * int(SR[engine] * sec)


def lines_audio(voices, lines):
    out = b""
    for i, (who, text) in enumerate(lines):
        if i:
            out += silence(PAUSE_LINE)
        out += line_wav(voices[who], who, text)
    return out


def write_m4a(frames, dest):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as t:
        tmp = t.name
    with wave.open(tmp, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR[engine])
        w.writeframes(frames)
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "48000", tmp, str(dest)], check=True)
    Path(tmp).unlink()
    return len(frames) / 2 / SR[engine]


def main(folder, sample=False):
    global engine
    folder = Path(folder)
    script = json.loads((folder / "script.json").read_text(encoding="utf-8"))
    engine = script.get("engine", "say")
    voices = script["voices"]
    adir = folder / "audio"
    adir.mkdir(exist_ok=True)
    for part in script["parts"]:
        full = lines_audio(voices, part["intro"]) + silence(PAUSE_BLOCK)
        full += lines_audio(voices, part["exampleLines"]) + silence(PAUSE_BLOCK)
        write_m4a(full, adir / f"{part['id']}-intro.m4a")
        if sample:
            print(f"sample: {adir / (part['id'] + '-intro.m4a')}")
            return
        for q in part["questions"]:
            one = lines_audio(voices, q["lines"])
            full += one + silence(PAUSE_QUESTION)
            write_m4a(one + silence(0.5), adir / f"{part['id']}-q{q['q']}.m4a")
        full += line_wav(voices["R"], "R", "That is the end of " + part["title"] + ".")
        secs = write_m4a(full, adir / f"{part['id']}-full.m4a")
        print(f"{part['id']}: {secs:.0f} s")


if __name__ == "__main__":
    main(sys.argv[1], sample="--sample" in sys.argv[2:])
