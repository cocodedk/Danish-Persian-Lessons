#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import wave
from importlib.metadata import version
from pathlib import Path

import imageio_ffmpeg
from piper import PiperVoice, SynthesisConfig

from common import REPORTS, WORK, config, jobs, require_model, run, source_hash, write_json


def audio_metrics(ffmpeg: str, path: Path) -> tuple[int, float, float]:
    result = run([
        ffmpeg, "-hide_banner", "-nostats", "-i", str(path),
        "-af", "loudnorm=I=-20:TP=-1:LRA=7:print_format=json",
        "-f", "null", "-",
    ], capture=True)
    blocks = re.findall(r"\{[^{}]+\}", result.stderr, flags=re.S)
    duration = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", result.stderr)
    if not blocks or not duration:
        raise RuntimeError(f"No audio measurements for {path.name}")
    hours, minutes, seconds = duration.groups()
    duration_ms = round((int(hours) * 3600 + int(minutes) * 60 + float(seconds)) * 1000)
    data = json.loads(blocks[-1])
    integrated_lufs = float(data["input_i"])
    if not -100 < integrated_lufs < 0:
        raise RuntimeError(f"No integrated loudness measurement for {path.name}")
    return duration_ms, integrated_lufs, float(data["input_tp"])


def normalization_filter(ffmpeg: str, path: Path, cfg: dict) -> str:
    target = (
        f"I={cfg['integratedLufs']}:TP={cfg['truePeakDbtp']}:"
        "LRA=7:print_format=json"
    )
    padding = f"apad=whole_dur={cfg['minimumClipSeconds']}"
    result = run([
        ffmpeg, "-hide_banner", "-nostats", "-i", str(path),
        "-af", f"{padding},loudnorm={target}",
        "-f", "null", "-",
    ], capture=True)
    blocks = re.findall(r"\{[^{}]+\}", result.stderr, flags=re.S)
    if not blocks:
        raise RuntimeError(f"No normalization measurement for {path.name}")
    data = json.loads(blocks[-1])
    measured = [
        data["input_i"], data["input_tp"], data["input_lra"],
        data["input_thresh"], data["target_offset"],
    ]
    if any(value in {"-inf", "inf"} for value in measured):
        raise RuntimeError(f"Invalid normalization measurement for {path.name}")
    return (
        f"{padding},loudnorm=I={cfg['integratedLufs']}:TP={cfg['truePeakDbtp']}:LRA=7:"
        f"measured_I={data['input_i']}:measured_TP={data['input_tp']}:"
        f"measured_LRA={data['input_lra']}:measured_thresh={data['input_thresh']}:"
        f"offset={data['target_offset']}:linear=false"
    )


def encode_mp3(ffmpeg: str, wav_path: Path, mp3_path: Path, cfg: dict, audio_filter: str) -> None:
    run([
        ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
        "-i", str(wav_path), "-af",
        audio_filter,
        "-ar", str(cfg["sampleRate"]), "-ac", "1",
        "-c:a", "libmp3lame", "-b:a", cfg["bitrate"], str(mp3_path),
    ])


def synthesize_one(
    voice: PiperVoice,
    ffmpeg: str,
    cfg: dict,
    job: dict,
) -> dict:
    WORK.mkdir(parents=True, exist_ok=True)
    REPORTS.mkdir(parents=True, exist_ok=True)
    digest = source_hash(job, cfg)
    stem = f"{job['clipId']}.{digest[:12]}"
    wav_path = WORK / f"{stem}.wav"
    mp3_path = WORK / f"{stem}.mp3"

    with wave.open(str(wav_path), "wb") as wav_file:
        voice.synthesize_wav(
            job["synthesisText"],
            wav_file,
            syn_config=SynthesisConfig(length_scale=cfg["lengthScale"]),
        )

    audio_filter = normalization_filter(ffmpeg, wav_path, cfg)

    encode_mp3(ffmpeg, wav_path, mp3_path, cfg, audio_filter)
    duration_ms, integrated_lufs, true_peak = audio_metrics(ffmpeg, mp3_path)
    correction_db = 0.0
    if not (-22 <= integrated_lufs <= -18 and true_peak <= -1):
        correction_db = round(cfg["integratedLufs"] - integrated_lufs, 2)
        corrected_filter = (
            f"{audio_filter},volume={correction_db}dB,"
            f"alimiter={cfg['correctionLimiter']}"
        )
        encode_mp3(ffmpeg, wav_path, mp3_path, cfg, corrected_filter)
        duration_ms, integrated_lufs, true_peak = audio_metrics(ffmpeg, mp3_path)
    if not (-22 <= integrated_lufs <= -18 and true_peak <= -1):
        raise RuntimeError(
            f"Audio limits failed for {job['clipId']}: "
            f"{integrated_lufs} LUFS, {true_peak} dBTP"
        )
    report = {
        "clipId": job["clipId"],
        "entryId": job["entryId"],
        "formId": job["formId"],
        "transcript": job["transcript"],
        "synthesisText": job["synthesisText"],
        "sourceTextHash": digest,
        "draftFile": str(mp3_path.relative_to(WORK.parent)),
        "durationMs": duration_ms,
        "channels": 1,
        "integratedLufs": integrated_lufs,
        **({"loudnessCorrectionDb": correction_db} if correction_db else {}),
        "truePeakDbtp": true_peak,
        "bytes": mp3_path.stat().st_size,
        "engineVersion": version("piper-tts"),
        "voiceModel": cfg["voiceModel"],
        "modelSha256": cfg["voiceModelSha256"],
        "voiceLicense": cfg["voiceLicense"],
    }
    write_json(REPORTS / f"{stem}.json", report)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate local Persian audio drafts")
    parser.add_argument("--scope", choices=("talk", "writing"))
    parser.add_argument("--clip")
    args = parser.parse_args()

    cfg = config()
    model = require_model(cfg)
    voice = PiperVoice.load(model)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    selected = jobs(args.scope, args.clip)
    if not selected:
        print("No missing clips in this scope.")
        return
    print(f"Generating {len(selected)} local draft clip(s)...")
    reports = [synthesize_one(voice, ffmpeg, cfg, job) for job in selected]
    write_json(REPORTS / "latest.json", reports)
    print(f"Drafts: {WORK}")
    print("Nothing was published. Run the native review before approval.")


if __name__ == "__main__":
    main()
