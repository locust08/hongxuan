"""One-time native Canvas conversion of FFDec's exported drawing/timeline code.

The generated assets are committed. Neither FFDec nor an SWF is used by the app.
Run with Python after exporting `frame:canvas` into the original .local folders.
"""
from pathlib import Path
import base64
import hashlib
import re

project = Path(__file__).resolve().parents[1]
source_root = project.parent

def convert(export_folder: str, target: str, canvas_id: str, start: int = 0, fps: float = 30):
    folder = source_root / '.local' / export_folder
    html = (folder / 'frames.html').read_text(encoding='utf-8')
    helper = (folder / 'canvas.js').read_text(encoding='utf-8')
    helper = re.sub(r"window\.addEventListener\('load', function \(\) \{.*?(?=function drawMorphPath)", '', helper, flags=re.S)
    script = re.search(r'<script>(.*?)</script>', html, re.S).group(1)
    script = script.replace('document.getElementById("myCanvas")', f'document.getElementById("{canvas_id}")')
    output = project / 'public' / target
    output.mkdir(parents=True, exist_ok=True)
    def image_file(match):
        data = base64.b64decode(match.group(2))
        name = hashlib.sha256(data).hexdigest()[:16] + ('.jpg' if match.group(1).lower() in ['jpeg', 'jpg'] else '.png')
        (output / name).write_bytes(data)
        return '/' + target + '/' + name
    script = re.sub(r'data:image/(JPEG|PNG|JPG);base64,([^"\s]+)', image_file, script, flags=re.I)
    functions = re.findall(r'^function (\w+)\(', script, re.M)
    registry = 'var drawingFunctions = {' + ','.join(functions) + '};\n'
    helper = helper.replace('eval(obj + "(ctx,new cxform(0,0,0,0,255,255,255,255),frame,ratio,time);");', 'drawingFunctions[obj](ctx,new cxform(0,0,0,0,255,255,255,255),frame,ratio,time);')
    helper = helper.replace('eval(obj + "(ctx,ctrans,frame,ratio,time);");', 'drawingFunctions[obj](ctx,ctrans,frame,ratio,time);')
    image_names = sorted(set(re.findall(r'\b(imageObj\d+)\b', script)))
    animation = f'''
// Native 30fps drawing timeline. Frame count includes the original preload scene.
var images = [{','.join(image_names)}];
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
Promise.all(images.map(function(image) {{ return image.complete ? Promise.resolve() : new Promise(function(resolve) {{ image.onload=resolve; image.onerror=resolve; }}); }})).then(function() {{
  var started = performance.now();
  var forcedFrame = new URLSearchParams(location.search).get('headerFrame');
  function animate(now) {{
    frame = forcedFrame !== null ? Math.max({start}, Math.min(frames.length-1, Number(forcedFrame)||{start})) : (reducedMotion.matches ? {start} : {start} + Math.floor((now-started)*{fps}/1000) % (frames.length-{start}));
    drawFrame();
    canvas.dataset.frame = String(frame);
    if (forcedFrame === null && !reducedMotion.matches && canvas.isConnected) requestAnimationFrame(animate);
  }}
  requestAnimationFrame(animate);
}});
'''
    script = re.sub(r'window\.setInterval\(function\(\)\{nextFrame\(ctx,ctrans\);\},\d+\);\s*nextFrame\(ctx,ctrans\);', animation, script)
    result = '// Original Hong Xuan artwork converted offline to native HTML5 Canvas drawing commands.\n(function(){\nvar Filters;\n' + registry + helper + '\n' + script + '\n})();\n'
    if re.search(r'\beval\s*\(|new Function\s*\(|\.swf|ruffle|shockwave', result, re.I):
        raise ValueError('Unexpected runtime dependency or dynamic code execution')
    (output / 'animation.js').write_text(result, encoding='utf-8')
    print(target, 'native JavaScript bytes', len(result), 'image assets', len(image_names))

convert('header-canvas', 'header', 'hongxuan-header', start=35)
convert('intro-canvas', 'archive-intro', 'archive-intro', fps=12)
