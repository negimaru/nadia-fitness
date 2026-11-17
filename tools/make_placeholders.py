"""Generate branded placeholder images for class photos (assets/img/clases/<slug>.webp).

Usage (from the site root): python3 tools/make_placeholders.py
Requires Pillow. Edit CLASSES to add or rename a class.
"""
import sys
from PIL import Image, ImageDraw, ImageFont
W,H=1200,750
DISPLAY="assets/fonts/barlow-condensed-800-italic-latin.woff2"
SANS="assets/fonts/montserrat-var-normal-latin.woff2"
def sans(size,weight=700):
    f=ImageFont.truetype(SANS,size)
    try: f.set_variation_by_axes([weight])
    except Exception: pass
    return f
CLASSES=[
 ("dance-baby","Grupo Dance Baby","Baile · Peques",(201,44,122)),
 ("dance-intermedio","Grupo Dance Intermedio","Baile",(201,44,122)),
 ("dance-avanzado","Grupo Dance Avanzado","Baile",(201,44,122)),
 ("powerhiit","PowerHIIT","Fitness",(199,125,191)),
 ("aquafitness","Aquafitness","Fitness · Agua",(199,125,191)),
]
BG=(26,18,25)        # matches --surface in the dark theme: calm, flat, no glow
MUTED=(191,184,188)  # --ink-muted
logo=Image.open("assets/img/logo.png").convert("RGBA")
for slug,name,tag,color in CLASSES:
    im=Image.new("RGBA",(W,H),BG+(255,))
    # very faint logo watermark, bottom-right, so the card still reads as Nadia's
    wm=logo.resize((int(W*.62),int(logo.height*W*.62/logo.width)),Image.LANCZOS)
    wm.putalpha(wm.getchannel("A").point(lambda v:int(v*.05)))
    im.alpha_composite(wm,(W-wm.width+60,H-wm.height+40))
    d=ImageDraw.Draw(im)
    title=ImageFont.truetype(DISPLAY,104 if len(name)<16 else 88); label=sans(24,700)
    t=name.upper(); tw=d.textlength(t,font=title)
    y=H*.38
    d.text(((W-tw)/2,y),t,font=title,fill=(255,255,255))
    ly=y+title.size*1.08+14
    d.rectangle(((W-120)/2,ly,(W+120)/2,ly+3),fill=color)
    lt=tag.upper(); spacing=4
    lw=sum(d.textlength(ch,font=label) for ch in lt)+spacing*(len(lt)-1); x=(W-lw)/2
    for ch in lt:
        d.text((x,ly+22),ch,font=label,fill=MUTED); x+=d.textlength(ch,font=label)+spacing
    im.convert("RGB").save(f"assets/img/clases/{slug}.webp","WEBP",quality=84,method=6)
