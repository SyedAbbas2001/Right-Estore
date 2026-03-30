from pathlib import Path
patterns = ["KiddyShop", "kiddyshop"]
replacements = ["Right Estore", "rightestore"]
root = Path('.')
for path in root.rglob('*'):
    if path.suffix.lower() in ['.js', '.jsx', '.ts', '.tsx', '.md']:
        text = path.read_text(encoding='utf-8')
        new_text = text
        for pat, rep in zip(patterns, replacements):
            new_text = new_text.replace(pat, rep)
        if new_text != text:
            path.write_text(new_text, encoding='utf-8')
print('done')