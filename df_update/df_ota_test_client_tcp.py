#!/usr/bin/env python3
"""
df_ota_test_client_tcp.py
Test client for df-ota-agent (TCP JSON API)
"""

import socket
import json
import time
import sys
import os

# ================= CONFIG =================
AGENT_HOST = os.getenv("DF_OTA_AGENT_HOST", "127.0.0.1")
AGENT_PORT = int(os.getenv("DF_OTA_AGENT_PORT", "8099"))
UPDATE_URL = os.getenv(
    "DF_OTA_UPDATE_URL",
    "http://192.168.10.16/df_update/update.tar"
)
TIMEOUT_SEC = 10.0
# =========================================


def send_cmd(sock, obj):
    line = json.dumps(obj, ensure_ascii=False)
    sock.sendall((line + "\n").encode("utf-8"))


def recv_lines(sock, timeout=TIMEOUT_SEC):
    sock.settimeout(timeout)
    buf = b""
    while True:
        try:
            b = sock.recv(4096)
            if not b:
                break
            buf += b
            while b"\n" in buf:
                line, buf = buf.split(b"\n", 1)
                yield line.decode("utf-8", errors="replace").strip()
        except socket.timeout:
            break


def main():
    print("[TEST] DF OTA agent TCP test")
    print(f" Agent : {AGENT_HOST}:{AGENT_PORT}")
    print(f" Update: {UPDATE_URL}")
    print()

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(TIMEOUT_SEC)

    try:
        s.connect((AGENT_HOST, AGENT_PORT))
    except Exception as e:
        print("[ERROR] Cannot connect to df-ota-agent:", e)
        return 1

    print("[INFO] Connected")

    # 1) ping
    print("\n[CMD] ping")
    send_cmd(s, {"cmd": "ping"})
    for ln in recv_lines(s, 2.0):
        print(" ", ln)

    # 2) get_status
    print("\n[CMD] get_status")
    send_cmd(s, {"cmd": "get_status"})
    for ln in recv_lines(s, 2.0):
        print(" ", ln)

    # 3) apply_update
    print("\n[CMD] apply_update")
    send_cmd(s, {
        "cmd": "apply_update",
        "url": UPDATE_URL,
        "restart_target": "df-project.target",
        "reboot": "auto",     # auto | true | false
    })

    print("[INFO] Waiting for OTA status stream...\n")

    # stream OTA status until idle or timeout
    t0 = time.time()
    while True:
        for ln in recv_lines(s, 1.0):
            print(" ", ln)
            try:
                j = json.loads(ln)
                st = j.get("state", "")
                if st == "idle":
                    print("\n[INFO] OTA returned to idle -> done")
                    s.close()
                    return 0
            except Exception:
                pass

        if time.time() - t0 > 300:
            print("\n[WARN] Timeout waiting OTA finish")
            break

    s.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())

