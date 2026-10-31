"""Sätter ihop bildrutorna från render.py till video/intro.mp4, video/intro.webm och video/intro-poster.jpg."""
import json, subprocess, sys
WORK = sys.argv[1] if len(sys.argv) > 1 else '/tmp/film/render'
OUT = sys.argv[2] if len(sys.argv) > 2 else '../../video/'
FPS, XF = 25, 0.5
manus = json.load(open(WORK + '/manus.json'))
segs = []
for i, s in enumerate(manus):
    seg = f'{WORK}/seg{i:02d}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{WORK}/{i:02d}/%04d.jpg', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', seg], check=True)
    segs.append((seg, s['dur']))
inputs, flt, last, t = [], [], '0:v', segs[0][1]
for i, (seg, d) in enumerate(segs):
    inputs += ['-i', seg]
for i in range(1, len(segs)):
    off = t - XF
    lab = f'v{i}'
    flt.append(f'[{last}][{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[{lab}]')
    last, t = lab, off + segs[i][1]
fc = ';'.join(flt)
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', f'[{last}]', '-r', str(FPS), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT + 'intro.mp4'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', OUT + 'intro.mp4', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'realtime', '-cpu-used', '8', OUT + 'intro.webm'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '4.5', '-i', OUT + 'intro.mp4', '-frames:v', '1', '-q:v', '3', OUT + 'intro-poster.jpg'], check=True)
print('längd', round(t, 1), 's')
