"""Create the upload directory without build tools or network access."""
import pathlib,shutil,hashlib,json,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'dist';out.mkdir(exist_ok=True)
for name in ['index.html','style.css','SOURCES.md','RESOURCE_SOURCES.md']:
 shutil.copy2(root/name,out/name)
for folder in ['js','assets']:
 shutil.copytree(root/folder,out/folder,dirs_exist_ok=True)
(out/'data').mkdir(exist_ok=True)
for name in ['world.geojson','countries.json','sources.json','resources.json','acquisition.json','resources-acquisition.json']:
 shutil.copy2(root/'data'/name,out/'data'/name)
manifest={str(p.relative_to(out)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in out.rglob('*') if p.is_file() and p.name!='manifest.json'}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
with zipfile.ZipFile(root/'geoscope-v1.0.zip','w',zipfile.ZIP_DEFLATED) as archive:
 for p in out.rglob('*'):
  if p.is_file():archive.write(p,p.relative_to(out))
print(f'Distribution: {len(manifest)} files, {sum(p.stat().st_size for p in out.rglob("*") if p.is_file()):,} bytes')
